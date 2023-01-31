import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { USER_SCHEMA } from '../../user/entities/user.entity';

@Schema({
  timestamps: true,
})
export class FollowUser {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_SCHEMA,
  })
  user_id: string; // user_id is the user who is being followed

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_SCHEMA,
  })
  follower_id: string; // follower_id is the user who is following the user_id
}

export const FollowUserSchema = SchemaFactory.createForClass(FollowUser);

export const FOLLOW_USER_SCHEMA = 'follow_user';

export type FollowUserDocument = mongoose.HydratedDocument<FollowUser>;

export const FollowUserProvider: ModelDefinition = {
  name: FOLLOW_USER_SCHEMA,
  schema: FollowUserSchema,
};
