export class ConversationResponse {
  _id: string;
  avatar: string;
  description: string;
  deleted: number;
  is_notification: number;
  is_pinned: number;
  last_message: string;
  name: string;
  permission: number;
  status: number;
  thumbnail: string;
  type: number;
  createdAt: Date;
  updatedAt: Date;
  no_of_seen: number;
  position: number;

  constructor(conversation: ConversationResponse) {
    this._id = conversation?._id ?? null;
    this.avatar = conversation?.avatar ?? '';
    this.description = conversation?.description ?? '';
    this.deleted = conversation?.deleted ?? 0;
    this.is_notification = conversation?.is_notification ?? 0;
    this.is_pinned = conversation?.is_pinned ?? 0;
    this.last_message = conversation?.last_message ?? '';
    this.name = conversation?.name ?? '';
    this.status = conversation?.status ?? 0;
    this.thumbnail = conversation?.thumbnail ?? '';
    this.type = conversation?.type ?? 0;
    this.createdAt = conversation?.createdAt ?? null;
    this.updatedAt = conversation?.updatedAt ?? null;
    this.permission = conversation?.permission ?? 0;
    this.no_of_seen = conversation?.no_of_seen ?? 0;
    this.position = conversation.createdAt ? new Date(conversation.createdAt).getTime() : 0;
  }

  static mapList(conversation: ConversationResponse[]) {
    return conversation.map((item) => new ConversationResponse(item));
  }
}
