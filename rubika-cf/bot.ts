import { RubikaApi } from "./api";
import type * as Types from "./types";
import { RubikaConfigError, RubikaError } from "./errors";
import type { InlineMessage, Update } from "./types/updates";
import { InlineContext, MessageContext, UpdateContext } from "./context";

const LOG_PREFIX = "[rubika-cf]";

export class Bot {
  readonly api: RubikaApi;

  private readonly ignoreBotMessages: boolean;
  private readonly middlewares: Types.Middleware[] = [];
  private readonly commands = new Map<string, Types.Handler<MessageContext>>();
  private readonly hearsList: Types.Matcher<MessageContext>[] = [];
  private readonly actions: Types.Matcher<InlineContext>[] = [];
  private readonly handlers: {
    [K in keyof Types.EventMap]: Types.Handler<Types.EventMap[K]>[];
  } = { message: [], inline: [], started: [], stopped: [], update: [] };
  private errorHandler: Types.ErrorHandler = (err) =>
    console.error(LOG_PREFIX, err);

  constructor(token: string, options?: Types.RubikaBotOptions) {
    if (!token?.trim()) throw new RubikaConfigError("bot token is required");
    const { ignoreBotMessages = true, ...apiOptions } = options ?? {};
    this.ignoreBotMessages = ignoreBotMessages;
    this.api = new RubikaApi(token, apiOptions);
  }

  use(fn: Types.Middleware): this {
    this.middlewares.push(fn);
    return this;
  }

  command(names: string | string[], fn: Types.Handler<MessageContext>): this {
    for (const name of Array.isArray(names) ? names : [names]) {
      this.commands.set(name.replace(/^\//, "").toLowerCase(), fn);
    }
    return this;
  }

  hears(match: string | RegExp, fn: Types.Handler<MessageContext>): this {
    this.hearsList.push({ match, fn });
    return this;
  }

  action(match: string | RegExp, fn: Types.Handler<InlineContext>): this {
    this.actions.push({ match, fn });
    return this;
  }

  on<K extends keyof Types.EventMap>(
    event: K,
    fn: Types.Handler<Types.EventMap[K]>,
  ): this {
    if (!Object.prototype.hasOwnProperty.call(this.handlers, event)) {
      throw new RubikaConfigError(`Unknown event: ${String(event)}`);
    }
    (this.handlers[event] as Types.Handler<Types.EventMap[K]>[]).push(fn);
    return this;
  }

  catch(fn: Types.ErrorHandler): this {
    this.errorHandler = fn;
    return this;
  }

  async handleUpdate(payload: unknown): Promise<void> {
    let ctx: Types.Context | null;
    try {
      ctx = this.createContext(payload);
    } catch (err) {
      console.error(LOG_PREFIX, "invalid update payload", err);
      return;
    }
    if (!ctx) return;

    try {
      await this.run(ctx);
    } catch (err) {
      try {
        await this.errorHandler(err, ctx);
      } catch (nested) {
        console.error(LOG_PREFIX, "error handler failed", nested);
      }
    }
  }

  private createContext(payload: unknown): Types.Context | null {
    if (!payload || typeof payload !== "object") return null;
    const p = payload as { update?: Update; inline_message?: InlineMessage };

    if (p.inline_message) return new InlineContext(this.api, p.inline_message);

    const update = p.update;
    if (!update?.chat_id) return null;

    const msg = update.new_message;
    if (update.type === "NewMessage" && msg) {
      if (this.ignoreBotMessages && msg.sender_type === "Bot") return null;
      return new MessageContext(this.api, update, msg);
    }
    return new UpdateContext(this.api, update);
  }

  private run(ctx: Types.Context): Promise<void> {
    let last = -1;
    const dispatch = async (i: number): Promise<void> => {
      if (i <= last) throw new RubikaError("next() called multiple times");
      last = i;
      const mw = this.middlewares[i];
      if (!mw) return this.route(ctx);
      await mw(ctx, () => dispatch(i + 1));
    };
    return dispatch(0);
  }

  private route(ctx: Types.Context): Promise<void> {
    if (ctx instanceof InlineContext) return this.routeInline(ctx);
    if (ctx instanceof MessageContext) return this.routeMessage(ctx);
    return this.routeUpdate(ctx);
  }

  private async runMatchers<C extends MessageContext | InlineContext>(
    ctx: C,
    input: string,
    matchers: Types.Matcher<C>[],
  ): Promise<boolean> {
    for (const { match, fn } of matchers) {
      if (typeof match === "string") {
        if (input !== match) continue;
      } else {
        match.lastIndex = 0;
        const m = match.exec(input);
        if (!m) continue;
        ctx.match = m;
      }
      await fn(ctx);
      return true;
    }
    return false;
  }

  private async routeMessage(ctx: MessageContext): Promise<void> {
    if (ctx.command) {
      const handler = this.commands.get(ctx.command);
      if (handler) return void (await handler(ctx));
    }
    if (await this.runMatchers(ctx, ctx.text, this.hearsList)) return;
    for (const fn of this.handlers.message) await fn(ctx);
  }

  private async routeInline(ctx: InlineContext): Promise<void> {
    if (await this.runMatchers(ctx, ctx.buttonId ?? "", this.actions)) return;
    for (const fn of this.handlers.inline) await fn(ctx);
  }

  private async routeUpdate(ctx: UpdateContext): Promise<void> {
    if (ctx.type === "StartedBot") {
      for (const fn of this.handlers.started) await fn(ctx);
    } else if (ctx.type === "StoppedBot") {
      for (const fn of this.handlers.stopped) await fn(ctx);
    }
    for (const fn of this.handlers.update) await fn(ctx);
  }

  webhook(options: { secret: string }) {
    const secret = options.secret?.trim().replace(/^\/+|\/+$/g, "");
    if (!secret) throw new RubikaConfigError("webhook secret is required");
    const prefix = `/${secret}`;

    return async (
      request: Request,
      execCtx?: Types.ExecutionContext,
    ): Promise<Response> => {
      const { pathname } = new URL(request.url);
      const inScope = pathname === prefix || pathname.startsWith(`${prefix}/`);
      if (request.method !== "POST" || !inScope) {
        return new Response("Not found", { status: 404 });
      }

      let payload: unknown;
      try {
        payload = await request.json();
      } catch {
        return new Response("Bad request", { status: 400 });
      }

      const work = this.handleUpdate(payload);
      if (execCtx) execCtx.waitUntil(work);
      else await work;

      return new Response("OK");
    };
  }

  setWebhook(url: string) {
    return this.api.setWebhook(url);
  }
}
