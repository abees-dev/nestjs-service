import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class PushToken {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user_id: string;

  @Prop({
    type: String,
    default: '',
  })
  push_token: string;

  @Prop({
    type: String,
    default: '',
  })
  device_id: string;

  @Prop({
    type: String,
    default: '',
  })
  platform: string;
}

export const PushTokenSchema = SchemaFactory.createForClass(PushToken);

export const PUSH_TOKEN_SCHEMA = 'push_token';

export type PushTokenDocument = HydratedDocument<PushToken>;

export const PushTokenProvider: ModelDefinition = {
  name: PUSH_TOKEN_SCHEMA,
  schema: PushTokenSchema,
};
