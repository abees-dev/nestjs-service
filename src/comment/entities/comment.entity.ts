import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Comment {
  @Prop({ type: String, default: '' })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, index: true })
  user_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, index: true })
  post_id: string;

  @Prop({ type: Number, default: 0 })
  status: number;

  @Prop({ type: Number, default: 0 })
  deleted: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
  tag: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
  media: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
  comment_reply_id: string;

  @Prop({ type: Number, default: 0 })
  no_of_reaction: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_like: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_love: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_wow: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_haha: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_sad: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_angry: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_dear: number;

  @Prop({ type: String, default: '' })
  thumbnail: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export const COMMENT_SCHEMA = Comment.name;
export type CommentDocument = HydratedDocument<Comment>;

export const CommentProvider: ModelDefinition = {
  name: COMMENT_SCHEMA,
  schema: CommentSchema,
};
