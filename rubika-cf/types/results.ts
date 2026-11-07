import type { FileId } from ".";
import type { EnumChatAccess } from "./enums";
import type { Bot, Chat } from "./models";
import type { Update } from "./updates";

export interface GetMeResult {
  bot: Bot;
}

export interface SendMessageResult {
  message_id: string;
}

export interface SendPollResult {
  message_id: string;
}

export interface SendLocationResult {
  message_id: string;
}

export interface SendContactResult {
  message_id: string;
}

export interface GetChatResult {
  chat: Chat;
}

export interface GetUpdatesResult {
  updates: Update[];
  next_offset_id: string;
}

export interface ForwardMessageResult {
  new_message_id: string;
}

export interface GetFileResult {
  download_url: string;
}

export interface SendFileResult {
  message_id: string;
}

export interface RequestSendFileResult {
  upload_url: string;
}

export interface UploadFileResult {
  file_id: FileId;
}

export interface ChatMember {
  user_id: string;
  status: string;
  access_list: EnumChatAccess[];
}

export interface GetChatMember {
  chat_member: ChatMember;
  status_message: string;
  status: string;
}
