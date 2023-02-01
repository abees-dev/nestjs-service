import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, index: true })
  conversation_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, index: true })
  user_id: string;

  @Prop({ type: String, default: '' })
  message: string;

  @Prop({ type: Number, default: 0 })
  type: number; // 0: text, 1: image, 2: video, 3: file, 4: audio, 5: location, 6: contact, 7: sticker, 8: gif, 9: link, 10: system, 11: reaction, 12: reply, 13: revoke, 14: call, 15: call_end, 16: call_missed,17: new-member, 18: new-group

  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
  tag: string[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
  medias: string[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
  target_user: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
  message_reply_id: string;

  @Prop({ type: String, default: '' })
  link: string;

  @Prop({ type: String, default: '' })
  thumbnail: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
export const MESSAGE_SCHEMA = Message.name;
export type MessageDocument = HydratedDocument<Message>;
export const MessageProvider: ModelDefinition = {
  name: MESSAGE_SCHEMA,
  schema: MessageSchema,
};
