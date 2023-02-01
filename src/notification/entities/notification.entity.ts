import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Notification {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user_id: string;

  @Prop({
    type: String,
    default: '',
  })
  title: string;

  @Prop({
    type: String,
    default: '',
  })
  content: string;

  @Prop({
    type: Number,
    default: 0,
  })
  notification_type: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  object_id: string;

  @Prop({
    type: Number,
    default: 0,
  })
  is_read: number;

  @Prop({
    type: Number,
    default: 0,
  })
  deleted: number;

  @Prop({
    type: String,
    default: '',
  })
  avatar: string;

  @Prop({
    type: String,
    default: '',
  })
  name: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

export const NOTIFICATION_SCHEMA = Notification.name;

export type NotificationDocument = HydratedDocument<Notification>;

export const NotificationProvider: ModelDefinition = {
  name: NOTIFICATION_SCHEMA,
  schema: NotificationSchema,
};
