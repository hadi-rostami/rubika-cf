import {
  RubikaApiError,
  RubikaConfigError,
  RubikaNetworkError,
} from "./errors";
import type * as Models from "./types/models";
import type * as Results from "./types/results";
import type * as Params from "./types/params";
import { UpdateEndpointTypeEnum } from "./types/enums";
import type { ApiResponse } from "./types/index";

export const DEFAULT_BASE_URL = "https://botapi.rubika.ir/v3";

export interface RubikaApiOptions {
  baseUrl?: string;
  timeoutMs?: number;
  fetch?: typeof fetch;
}

export class RubikaApi {
  private readonly token: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchFn: typeof fetch;

  constructor(token: string, options: RubikaApiOptions = {}) {
    if (!token || typeof token !== "string") {
      throw new RubikaConfigError("Bot token is required");
    }
    this.token = token;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs ?? 15_000;
    this.fetchFn = options.fetch ?? fetch.bind(globalThis);
  }

  async call<T = unknown>(method: string, params: object = {}): Promise<T> {
    const url = `${this.baseUrl}/${this.token}/${method}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let res: Response;
    
    try {
      res = await this.fetchFn(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal: controller.signal,
      });
    } catch (err) {
      throw new RubikaNetworkError(method, err);
    } finally {
      clearTimeout(timer);
    }

    let body: ApiResponse<T> | undefined;
    try {
      body = (await res.json()) as ApiResponse<T>;
    } catch (err) {
      if (!res.ok) throw new RubikaApiError(method, res.status, undefined);
      throw new RubikaNetworkError(method, err);
    }

    if (!res.ok || body?.status !== "OK") {
      throw new RubikaApiError(method, res.status, body);
    }

    return body.data as T;
  }

  getMe() {
    return this.call<{ bot: Models.Bot }>("getMe");
  }

  getChat(chatId: string) {
    return this.call<{ chat: Models.Chat }>("getChat", { chat_id: chatId });
  }

  sendMessage(params: Params.SendMessageParams) {
    return this.call<Results.SendMessageResult>("sendMessage", params);
  }

  sendPoll(params: Params.SendPollParams) {
    return this.call<Results.SendPollResult>("sendPoll", params);
  }

  sendLocation(params: Params.SendLocationParams) {
    return this.call<Results.SendLocationResult>("sendLocation", params);
  }

  sendContact(params: Params.SendContactParams) {
    return this.call<Results.SendContactResult>("sendContact", params);
  }

  forwardMessage(params: Params.ForwardMessageParams) {
    return this.call<Results.ForwardMessageResult>("forwardMessage", params);
  }

  editMessageText(params: Params.EditMessageTextParams) {
    return this.call<unknown>("editMessageText", params);
  }

  editMessageKeypad(params: Params.EditMessageKeypadParams) {
    return this.call<unknown>("editMessageKeypad", params);
  }

  deleteMessage(params: Params.DeleteMessageParams) {
    return this.call<unknown>("deleteMessage", params);
  }
  editChatKeypad(params: Params.EditChatKeypadParams) {
    return this.call<unknown>("editChatKeypad", params);
  }

  getUpdates(params: Params.GetUpdatesParams = {}) {
    return this.call<Results.GetUpdatesResult>("getUpdates", params);
  }
  setCommands(params: Params.SetCommandsParams) {
    return this.call<unknown>("setCommands", params);
  }
  getFile(params: Params.GetFileParams) {
    return this.call<Results.GetFileResult>("getFile", params);
  }

  requestSendFile(params: Params.RequestSendFileParams) {
    return this.call<Results.RequestSendFileResult>("requestSendFile", params);
  }

  sendFile(params: Params.SendFileParams) {
    return this.call<Results.SendFileResult>("sendFile", params);
  }

  banChatMember(params: Params.BanChatMemberParams) {
    return this.call<unknown>("banChatMember", params);
  }

  unbanChatMember(params: Params.UnbanChatMemberParams) {
    return this.call<unknown>("unbanChatMember", params);
  }

  getChatMember(params: Params.GetChatMemberParams) {
    return this.call<Results.GetChatMember>("getChatMember", params);
  }

  updateBotEndpoints(url: string, type: UpdateEndpointTypeEnum) {
    return this.call<unknown>("updateBotEndpoints", { url, type });
  }

  async setWebhook(baseUrl: string) {
    const url = baseUrl.replace(/\/+$/, "");
    await this.updateBotEndpoints(url, UpdateEndpointTypeEnum.ReceiveUpdate);
    await this.updateBotEndpoints(
      url,
      UpdateEndpointTypeEnum.ReceiveInlineMessage,
    );
  }
}
