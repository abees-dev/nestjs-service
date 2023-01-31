import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from '../../post/entities/post.entity';

@Schema({
  timestamps: true,
})
export class Conversation {
  @Prop({ type: String, default: '' })
  name: string;

  @Prop({ type: String, default: '' })
  avatar: string;

  @Prop({ type: String, default: '' })
  thumbnail: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId] })
  members: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
  last_message: string;

  @Prop({ type: Number, default: 0 })
  type: number; // 0: private, 1: group

  @Prop({ type: Number, default: 1 })
  status: number; // 1: active, 0: inactive

  @Prop({ type: Number, default: 1 })
  is_notification: number;

  @Prop({ type: Number, default: 0 })
  is_deleted: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  setting: string;

  @Prop({ type: Date, default: Date.now() })
  last_message_at: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

export const CONVERSATION_SCHEMA = Conversation.name;

export type ConversationDocument = HydratedDocument<Conversation>;

export const ConversationProvider: ModelDefinition = {
  name: CONVERSATION_SCHEMA,
  schema: ConversationSchema,
};
