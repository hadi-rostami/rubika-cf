import { UpdateTypeEnum } from "./enums";
import type { AuxData, Location, Message } from "./models";
import type { ChatId, MessageId, UserId } from "./index";

export interface Update {
  type: UpdateTypeEnum;
  chat_id: ChatId;

  removed_message_id?: MessageId | null;
  new_message?: Message;
  updated_message?: Message | null;
  event_data?: Event;
}

export interface Event {
  type: string;
  access_list?: string[] | null;
  join_type?: string;
}

export interface InlineMessage {
  sender_id: UserId;
  text?: string;
  file?: File | null;
  location?: Location | null;
  aux_data?: AuxData | null;
  message_id: MessageId;
  chat_id: ChatId;
}

export interface UpdatePayload {
  update: Update;
}

export interface InlineMessagePayload {
  inline_message: InlineMessage;
}
