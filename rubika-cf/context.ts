import type { RubikaApi } from "./api";
import type * as Models from "./types/models";
import type * as Params from "./types/params";
import type { InlineMessage, Update } from "./types/updates";

export type SendExtra = Omit<Params.SendMessageParams, "chat_id" | "text">;
type MessageId = Models.Message["message_id"];

export abstract class BaseContext {
  match: RegExpMatchArray | null = null;
  readonly state: Record<string, unknown> = {};

  constructor(
    readonly api: RubikaApi,
    readonly chatId: string,
  ) {}

  reply(text: string, extra?: SendExtra) {
    return this.api.sendMessage({ chat_id: this.chatId, text, ...extra });
  }

  replyWithFile(fileId: string, extra?: SendExtra) {
    return this.api.sendFile({
      chat_id: this.chatId,
      file_id: fileId,
      ...extra,
    });
  }

  editText(messageId: MessageId, text: string) {
    return this.api.editMessageText({
      chat_id: this.chatId,
      message_id: messageId,
      text,
    });
  }

  editKeypad(
    messageId: MessageId,
    inlineKeypad: Params.EditMessageKeypadParams["inline_keypad"],
  ) {
    return this.api.editMessageKeypad({
      chat_id: this.chatId,
      message_id: messageId,
      inline_keypad: inlineKeypad,
    });
  }

  deleteMessage(messageId: MessageId) {
    return this.api.deleteMessage({
      chat_id: this.chatId,
      message_id: messageId,
    });
  }

  forwardMessage(messageId: MessageId, toChatId: string) {
    return this.api.forwardMessage({
      from_chat_id: this.chatId,
      message_id: messageId,
      to_chat_id: toChatId,
    });
  }
}

export class UpdateContext extends BaseContext {
  constructor(
    api: RubikaApi,
    readonly update: Update,
  ) {
    super(api, update.chat_id);
  }

  get type(): string {
    return this.update.type;
  }
}

export class MessageContext extends UpdateContext {
  readonly message: Models.Message;
  readonly messageId: MessageId;
  readonly text: string;
  readonly senderId?: string;
  readonly command?: string;
  readonly args: string[] = [];

  constructor(api: RubikaApi, update: Update, message: Models.Message) {
    super(api, update);
    this.message = message;
    this.messageId = message.message_id;
    this.text = message.text ?? "";
    this.senderId = message.sender_id;

    const m = /^\/([^\s@]+)(?:@\S+)?(?:\s+([\s\S]*))?$/.exec(this.text.trim());
    if (m) {
      this.command = m[1]!.toLowerCase();
      this.args = (m[2] ?? "").split(/\s+/).filter(Boolean);
    }
  }
}

export class InlineContext extends BaseContext {
  readonly messageId: MessageId;
  readonly senderId: string;
  readonly text: string;
  readonly buttonId?: string;
  readonly startId?: string;

  constructor(
    api: RubikaApi,
    readonly inline: InlineMessage,
  ) {
    super(api, inline.chat_id);
    this.messageId = inline.message_id;
    this.senderId = inline.sender_id;
    this.text = inline.text ?? "";
    this.buttonId = inline.aux_data?.button_id ?? undefined;
    this.startId = inline.aux_data?.start_id ?? undefined;
  }
}
