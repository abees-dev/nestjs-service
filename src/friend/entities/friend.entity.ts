import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { USER_SCHEMA } from '../../user/entities/user.entity';

@Schema({
  timestamps: true,
})
export class Friend {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_SCHEMA,
  })
  sender_id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_SCHEMA,
  })
  receiver_id: string;

  @Prop({
    type: Number,
    default: 0,
  })
  status: number;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

export const FRIEND_SCHEMA = Friend.name;

export type FriendDocument = HydratedDocument<Friend>;

export const FriendProvider: ModelDefinition = {
  name: FRIEND_SCHEMA,
  schema: FriendSchema,
};
