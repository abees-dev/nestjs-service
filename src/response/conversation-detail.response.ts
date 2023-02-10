import { ConversationSettingResponse } from './convsersation-setting.response';

export class ConversationDetailResponse {
  _id: string;
  avatar: string;
  description: string;
  deleted: number;
  is_notification: number;
  is_pinned: number;
  last_message: string;
  name: string;
  setting: ConversationSettingResponse;
  status: number;
  thumbnail: string;
  type: number;
  createdAt: Date;
  updatedAt: Date;
  permission?: number;
  user_id?: string;

  constructor(conversation: ConversationDetailResponse) {
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
    this.user_id = conversation?.user_id ?? '';
    this.setting = new ConversationSettingResponse(conversation?.setting) ?? null;
  }
}
