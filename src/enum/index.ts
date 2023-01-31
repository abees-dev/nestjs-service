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

// 0: public, 1: private (only friends), 2: only me
