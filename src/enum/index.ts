export enum BOOLEAN {
  TRUE = 1,
  FALSE = 0,
}

export enum METHOD {
  ADD = 1,
  REMOVE = 0,
}

export enum CONTACT_TYPE {
  NONE = 0,
  FRIEND = 1,
  REQUEST = 2,
  PENDING = 3,
  IT_ME = 4,
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

export enum MESSAGE_PATTERN {
  NOTIFY_PRIORITY_HANDLER = 'notify-priority-handler',
  ADD_NEW_FOLLOWER = 'add-new-follower',
  REMOVE_FOLLOWER = 'remove-follower',
  ADD_NEW_FOLLOW_POST = 'add-new-follow-post',
  UPDATE_NO_OF_FOLLOWER = 'update-no-of-follower',
  UPDATE_NO_OF_FRIEND = 'update-no-of-friend',
  REACTION_POST = 'reaction-post',
  REACTION_COMMENT = 'reaction-comment',
  DETECT_REACTION = 'detect-reaction',
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

export enum NOTIFICATION_TYPE {
  NEW_MESSAGE = 0,
  SEND_FRIEND = 1,
  ACCEPT_FRIEND = 2,
  COMMENT_POST = 3,
  REACTION_POST = 4,
  REACTION_COMMENT = 5,
}

// 0: public, 1: private (only friends), 2: only me
