import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class FollowPost {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  post_id: string;
}

export const FollowPostSchema = SchemaFactory.createForClass(FollowPost);
export const FOLLOW_POST_SCHEMA = 'follow_post';
export type FollowPostDocument = HydratedDocument<FollowPost>;
export const FollowPostProvider: ModelDefinition = {
  name: FOLLOW_POST_SCHEMA,
  schema: FollowPostSchema,
};
