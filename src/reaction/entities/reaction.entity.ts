import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Reaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  object_id: string; // post_id, comment_id,  message_id

  @Prop({
    type: Number,
    default: 0, // 0: post, 1: comment,  2: message
  })
  object_type: number;

  @Prop({
    type: Number,
    default: 0,
  })
  type: number; // 0: like, 1: love, 2: haha, 3: wow, 4: sad, 5: angry, 6: dear

  @Prop({
    type: Number,
    default: 0,
  })
  deleted: number;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
export type ReactionDocument = HydratedDocument<Reaction>;
export const REACTION_SCHEMA = Reaction.name;
export const ReactionProvider: ModelDefinition = {
  name: REACTION_SCHEMA,
  schema: ReactionSchema,
};
