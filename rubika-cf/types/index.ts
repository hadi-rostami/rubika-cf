import type { RubikaApiOptions } from "../api";
import type { InlineContext, MessageContext, UpdateContext } from "../context";
import {
  ButtonCalendarTypeEnum,
  ButtonLocationTypeEnum,
  ButtonTextboxTypeKeypadEnum,
  ButtonTextboxTypeLineEnum,
  ButtonTypeEnum,
  MetadataTypeEnum,
} from "./enums";

/* =========================
 * Primitive Types
 * ========================= */

export type ChatId = string;
export type UserId = string;
export type MessageId = string;
export type FileId = string;
export type BotToken = string;

/* =========================
 * Keypad
 * ========================= */

export interface KeypadRow {
  buttons: Button[];
}

export interface Keypad {
  rows: KeypadRow[];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
}

export interface Button {
  id: string;
  type: ButtonTypeEnum;
  button_text: string;

  selection?: ButtonSelection;
  calendar?: ButtonCalendar;
  number_picker?: ButtonNumberPicker;
  string_picker?: ButtonStringPicker;
  textbox?: ButtonTextbox;
  location?: ButtonLocation;
}

export interface ButtonSelectionItem {
  text: string;
  value: string;
}

export interface ButtonSelection {
  selection_id: string;
  search_type?: string;
  get_type?: string;
  items?: ButtonSelectionItem[];
  is_multi_selection?: boolean;
  columns_count?: string;
  title?: string;
}

export interface ButtonCalendar {
  default_value?: string;
  type: ButtonCalendarTypeEnum;
  min_year?: string;
  max_year?: string;
  title?: string;
}

export interface ButtonNumberPicker {
  min_value: string;
  max_value: string;
  default_value?: string;
  title?: string;
}

export interface ButtonStringPicker {
  items: string[];
  default_value?: string;
  title?: string;
}

export interface ButtonTextbox {
  type_line: ButtonTextboxTypeLineEnum;
  type_keypad: ButtonTextboxTypeKeypadEnum;
  place_holder?: string;
  title?: string;
  default_value?: string;
}

export interface ButtonLocation {
  type: ButtonLocationTypeEnum;
  title?: string;
}

/* =========================
 * Metadata
 * ========================= */

export interface Metadata {
  meta_data_parts: MetadataPart[];
}

export interface MetadataPart {
  type: MetadataTypeEnum;
  from_index: number;
  length: number;

  link_url?: string;
  mention_text_user_id?: UserId;
}

/* =========================
 * APi response
 * ========================= */

export interface ApiResponse<T = unknown> {
  status: string;
  status_det?: string;
  data?: T;
}

/* =========================
 * Bot.ts types
 * ========================= */
export type AnyContext = MessageContext | UpdateContext | InlineContext;
export type Next = () => Promise<void>;
export type Middleware = (ctx: AnyContext, next: Next) => unknown;
export type Handler<C> = (ctx: C) => unknown;
export type ErrorHandler = (err: unknown, ctx: AnyContext) => unknown;

export interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
}

export interface RubikaBotOptions extends RubikaApiOptions {
  ignoreBotMessages?: boolean;
}

export interface EventMap {
  message: MessageContext;
  inline: InlineContext;
  started: UpdateContext;
  stopped: UpdateContext;
  update: UpdateContext;
}

export interface Matcher<C> {
  match: string | RegExp;
  fn: Handler<C>;
}
