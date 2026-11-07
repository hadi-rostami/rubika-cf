import { ChatTypeEnum, MessageSenderEnum } from "./enums";
import type { ChatId, FileId, MessageId, Metadata, UserId } from "./index";

export interface Bot {
  bot_id: string;
  bot_title: string;
  username: string;
}

export interface Chat {
  chat_id: ChatId;
  chat_type: ChatTypeEnum;
  user_id?: UserId | null;
  first_name?: string | null;
  last_name?: string | null;
  title?: string | null;
  username?: string | null;
}

export interface File {
  file_id: FileId;
  file_name?: string;
  size?: string;
}

export interface Location {
  latitude: string;
  longitude: string;
}

export interface BotCommand {
  command: string;
  description: string;
}

export interface AuxData {
  start_id?: string | null;
  button_id?: string | null;
}

export interface ForwardedFrom {
  type_from: string;
  message_id: MessageId;
  from_chat_id: ChatId;
  from_sender_id: UserId;
}

export interface ContactMessage {
  first_name: string;
  last_name?: string;
  phone_number: string;
}

export interface MessageTextUpdate {
  message_id: MessageId;
  text: string;
}

export interface Message {
  message_id: MessageId;
  text?: string;
  time?: string;
  is_edited?: boolean;
  sender_type?: MessageSenderEnum;
  sender_id?: UserId;
  chat_id?: ChatId;
  aux_data?: AuxData | null;
  file?: File | null;
  location?: Location | null;
  contact_message?: ContactMessage | null;
  forwarded_from?: ForwardedFrom | null;
  metadata?: Metadata | null;
}
