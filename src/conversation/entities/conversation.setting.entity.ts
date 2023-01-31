import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class ConversationSetting {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  conversation_id: string;

  @Prop({
    type: Number,
    default: 1,
  })
  is_invited: number;

  @Prop({
    type: Number,
    default: 0,
  })
  is_blocked: number;

  @Prop({
    type: Number,
    default: 0,
  })
  is_remove_member: number;

  @Prop({
    type: Number,
    default: 0,
  })
  is_change_name: number;

  @Prop({
    type: Number,
    default: 0,
  })
  is_change_avatar: number;

  @Prop({
    type: Number,
    default: 1,
  })
  is_pin_message: number;

  @Prop({
    type: Number,
    default: 1,
  })
  is_send_message: number;
}

export const ConversationSettingSchema = SchemaFactory.createForClass(ConversationSetting);
export const CONVERSATION_SETTING_SCHEMA = 'conversation_setting';
export type ConversationSettingDocument = HydratedDocument<ConversationSetting>;
export const ConversationSettingProvider = {
  name: CONVERSATION_SETTING_SCHEMA,
  schema: ConversationSettingSchema,
};
