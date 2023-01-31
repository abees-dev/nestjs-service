import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Auth {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  })
  user_id: string;

  @Prop({
    type: String,
    required: true,
  })
  access_token: string;

  @Prop({
    type: String,
    required: true,
  })
  refresh_token: string;
}

export const AUTH_SCHEMA = Auth.name;
export type AuthDocument = HydratedDocument<Auth>;
export const AuthSchema = SchemaFactory.createForClass(Auth);
export const AuthProvider: ModelDefinition = {
  name: AUTH_SCHEMA,
  schema: AuthSchema,
};
