import { ConversationSetting } from '../conversation/entities/conversation.setting.entity';

export class ConversationSettingResponse {
  is_blocked: number;
  is_change_avatar: number;
  is_change_name: number;
  is_invited: number;
  is_pin_message: number;
  is_remove_member: number;
  is_send_message: number;
  conversation_id: string;
  permission?: number;

  constructor(conversationSetting: ConversationSetting) {
    this.conversation_id = conversationSetting?.conversation_id ?? '';
    this.is_blocked = conversationSetting?.is_blocked ?? 0;
    this.is_change_avatar = conversationSetting?.is_change_avatar ?? 0;
    this.is_change_name = conversationSetting?.is_change_name ?? 0;
    this.is_invited = conversationSetting?.is_invited ?? 0;
    this.is_pin_message = conversationSetting?.is_pin_message ?? 0;
    this.is_remove_member = conversationSetting?.is_remove_member ?? 0;
    this.is_send_message = conversationSetting?.is_send_message ?? 0;
  }
}
