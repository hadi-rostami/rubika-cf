export enum ChatTypeEnum {
  User = "User",
  Group = "Group",
  Channel = "Channel",
}

export enum FileTypeEnum {
  Image = "Image",
  Video = "Video",
  Voice = "Voice",
  Music = "Music",
  Gif = "Gif",
  File = "File",
}

export enum MessageSenderEnum {
  User = "User",
  Bot = "Bot",
}

export enum UpdateTypeEnum {
  NewMessage = "NewMessage",
  UpdatedMessage = "UpdatedMessage",
  RemovedMessage = "RemovedMessage",
  StartedBot = "StartedBot",
  StoppedBot = "StoppedBot",
  EventData = "EventData",
}

export enum ChatKeypadTypeEnum {
  None = "None",
  New = "New",
  Remove = "Remove",
}

export enum UpdateEndpointTypeEnum {
  ReceiveUpdate = "ReceiveUpdate",
  ReceiveInlineMessage = "ReceiveInlineMessage",
  ReceiveQuery = "ReceiveQuery",
  GetSelectionItem = "GetSelectionItem",
  SearchSelectionItems = "SearchSelectionItems",
}

export enum ButtonTypeEnum {
  Simple = "Simple",
  Selection = "Selection",
  Calendar = "Calendar",
  NumberPicker = "NumberPicker",
  StringPicker = "StringPicker",
  Textbox = "Textbox",
  Location = "Location",
}

export enum MetadataTypeEnum {
  Bold = "Bold",
  Italic = "Italic",
  Mono = "Mono",
  Underline = "Underline",
  Strike = "Strike",
  Spoiler = "Spoiler",
  Link = "Link",
  MentionText = "MentionText",
  Pre = "Pre",
  Quote = "Quote",
}

export enum ButtonCalendarTypeEnum {
  DatePersian = "DatePersian",
  DateGregorian = "DateGregorian",
}

export enum ButtonTextboxTypeKeypadEnum {
  String = "String",
  Number = "Number",
}

export enum ButtonTextboxTypeLineEnum {
  SingleLine = "SingleLine",
  MultiLine = "MultiLine",
}

export enum ButtonLocationTypeEnum {
  Picker = "Picker",
  View = "View",
}



export enum EnumChatAccess {
  SendMessages = "SendMessages",
  EditMyMessages = "EditMyMessages",
  EditAllMessages = "EditAllMessages",
  DeleteGlobalAllMessages = "DeleteGlobalAllMessages",
  ViewMembers = "ViewMembers",
  BanMember = "BanMember",
}