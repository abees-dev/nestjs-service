import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class MessageRemove {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  user_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  message_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  conversation_id: string;
}

export const MessageRemoveSchema = SchemaFactory.createForClass(MessageRemove);

export const MESSAGE_REMOVE_SCHEMA = 'message_remove';

export type MessageRemoveDocument = HydratedDocument<MessageRemove>;

export const MessageRemoveProvider = {
  name: MESSAGE_REMOVE_SCHEMA,
  schema: MessageRemoveSchema,
};
