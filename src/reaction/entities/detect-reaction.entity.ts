import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class DetectReaction {
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
    default: 0,
  })
  deleted: number;
}

export const DetectReactionSchema = SchemaFactory.createForClass(DetectReaction);
export type DetectReactionDocument = HydratedDocument<DetectReaction>;
export const DETECT_REACTION_SCHEMA = DetectReaction.name;
export const DetectReactionProvider: ModelDefinition = {
  name: DETECT_REACTION_SCHEMA,
  schema: DetectReactionSchema,
};
