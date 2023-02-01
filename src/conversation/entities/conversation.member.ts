import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { USER_SCHEMA } from '../../user/entities/user.entity';

@Schema({
  timestamps: true,
})
export class ConversationMember {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  conversation_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: USER_SCHEMA })
  user_id: string;

  @Prop({ type: Number, default: 0 })
  is_admin: number;

  @Prop({ type: Number, default: 0 })
  permission: number; // 0: member, 1: deputy, 2: admin

  @Prop({ type: Number, default: 1 })
  status: number; // 1: active, 0: inactive

  @Prop({ type: Number, default: 0 })
  is_deleted: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId,default: new mongoose.Types.ObjectId() })
  last_seen_message: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() })
  last_removed_message: string;

  @Prop({ type: Number, default: 0 })
  is_pinned: number;
}

export const ConversationMemberSchema = SchemaFactory.createForClass(ConversationMember);
export const CONVERSATION_MEMBER_SCHEMA = 'conversation_member';
export type ConversationMemberDocument = HydratedDocument<ConversationMember>;
export const ConversationMemberProvider = {
  name: CONVERSATION_MEMBER_SCHEMA,
  schema: ConversationMemberSchema,
};
