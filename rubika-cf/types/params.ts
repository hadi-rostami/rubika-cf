import {
  ChatKeypadTypeEnum,
  FileTypeEnum,
  UpdateEndpointTypeEnum,
} from "./enums";
import type { BotCommand } from "./models";
import type {
  ChatId,
  UserId,
  MessageId,
  FileId,
  Keypad,
  Metadata,
} from "./index";

/* getMe */
export interface GetMeParams {}

/* sendMessage */
export interface SendMessageParams {
  chat_id: ChatId;
  text: string;
  chat_keypad?: Keypad;
  inline_keypad?: Keypad;
  metadata?: Metadata;
  disable_notification?: boolean;
  reply_to_message_id?: MessageId;
  chat_keypad_type?: ChatKeypadTypeEnum;
}

/* sendPoll */
export interface SendPollParams {
  chat_id: ChatId;
  question: string;
  options: string[];
}

/* sendLocation */
export interface SendLocationParams {
  chat_id: ChatId;
  latitude: string;
  longitude: string;
  chat_keypad?: Keypad;
  inline_keypad?: Keypad;
  disable_notification?: boolean;
  reply_to_message_id?: MessageId;
  chat_keypad_type?: ChatKeypadTypeEnum;
}

/* sendContact */
export interface SendContactParams {
  chat_id: ChatId;
  first_name: string;
  last_name?: string;
  phone_number: string;
  chat_keypad?: Keypad;
  inline_keypad?: Keypad;
  disable_notification?: boolean;
  reply_to_message_id?: MessageId;
  chat_keypad_type?: ChatKeypadTypeEnum;
}

/* getChat */
export interface GetChatParams {
  chat_id: ChatId;
}

/* getUpdates */
export interface GetUpdatesParams {
  offset_id?: string;
  limit?: number;
}

/* forwardMessage */
export interface ForwardMessageParams {
  from_chat_id: ChatId;
  message_id: MessageId;
  to_chat_id: ChatId;
  disable_notification?: boolean;
}

/* editMessageText */
export interface EditMessageTextParams {
  chat_id: ChatId;
  message_id: MessageId;
  text: string;
}

/* editMessageKeypad */
export interface EditMessageKeypadParams {
  chat_id: ChatId;
  message_id: MessageId;
  inline_keypad?: Keypad;
}

/* deleteMessage */
export interface DeleteMessageParams {
  chat_id: ChatId;
  message_id: MessageId;
}

/* setCommands */
export interface SetCommandsParams {
  bot_commands: BotCommand[];
}

/* updateBotEndpoints */
export interface UpdateBotEndpointsParams {
  url: string;
  type: UpdateEndpointTypeEnum;
}

/* editChatKeypad */
export interface EditChatKeypadParams {
  chat_id: ChatId;
  chat_keypad?: Keypad;
  chat_keypad_type: ChatKeypadTypeEnum;
}

/* getFile */
export interface GetFileParams {
  file_id: FileId;
}

/* sendFile */
export interface SendFileParams {
  chat_id: ChatId;
  file_id: FileId;
  text?: string;
  reply_to_message_id?: MessageId;
  disable_notification?: boolean;
  chat_keypad?: Keypad;
  inline_keypad?: Keypad;
  chat_keypad_type?: ChatKeypadTypeEnum;
}

/* requestSendFile */
export interface RequestSendFileParams {
  type: FileTypeEnum;
}

/* banChatMember */
export interface BanChatMemberParams {
  chat_id: ChatId;
  user_id: UserId;
}

/* unbanChatMember */
export interface UnbanChatMemberParams {
  chat_id: ChatId;
  user_id: UserId;
}

/* getChatMember */
export interface GetChatMemberParams {
  chat_id: ChatId;
  user_id: UserId;
}
