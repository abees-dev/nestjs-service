export enum BOOLEAN {
  TRUE = 1,
  FALSE = 0,
}

export enum CONTACT_TYPE {
  NONE = 0,
  FRIEND = 1,
  REQUEST = 2,
  PENDING = 3,
}

export enum VIEW {
  public = 0,
  private = 1,
  ONLY = 2,
}

export enum CONVERSATION_TYPE {
  PRIVATE = 0,
  GROUP = 1,
}

export enum CONVERSATION_PERMISSION {
  MEMBER = 0,
  DEPUTY = 1,
  ADMIN = 2,
}

export enum SOCKET_MESSAGE {
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  MESSAGE_TEXT = 'message_text',
  MESSAGE_IMAGE = 'message_image',
  MESSAGE_VIDEO = 'message_video',
  MESSAGE_FILE = 'message_file',
  MESSAGE_LINK = 'message_link',
  MESSAGE_LOCATION = 'message_location',
  MESSAGE_STICKER = 'message_sticker',
}

export enum MESSAGE_TYPE {
  TEXT = 0,
  IMAGE = 1,
  VIDEO = 2,
  FILE = 3,
  LINK = 4,
  LOCATION = 5,
  CONTACT = 6,
  STICKER = 7,
  VOICE = 8,
  GIF = 9,
  AUDIO = 10,
  VIDEO_CALL = 11,
  VIDEO_CALL_END = 12,
  VIDEO_CALL_MISSED = 13,
  NEW_MEMBER = 14,
  NEW_GROUP = 15,
  REVOKE = 16,
  REPLY = 17,
}

// 0: public, 1: private (only friends), 2: only me
