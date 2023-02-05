import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Feeling {
  @Prop({
    type: String,
    default: '',
  })
  name: string;

  @Prop({
    type: String,
    default: '',
  })
  facebook_id: string;

  @Prop({
    type: String,
    default: '',
  })
  icon: string;

  @Prop({
    type: String,
    default: '',
    indexes: true,
    text: true,
  })
  search: string;
}

export const FeelingSchema = SchemaFactory.createForClass(Feeling);
export const FEELING_SCHEMA = Feeling.name;
export type FeelingDocument = HydratedDocument<Feeling>;
export const FeelingProvider = {
  name: FEELING_SCHEMA,
  schema: FeelingSchema,
};
