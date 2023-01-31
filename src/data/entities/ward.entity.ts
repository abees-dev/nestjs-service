import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Ward {
  @Prop({
    type: Number,
    required: true,
    unique: true,
  })
  ward_id: number;

  @Prop({
    type: String,
    required: true,
    default: '',
  })
  ward_name: string;

  @Prop({
    type: String,
    required: true,
    default: '',
  })
  ward_slug: string;

  @Prop({
    type: Number,
    required: true,
  })
  district_id: number;
}

export const WARD_SCHEMA = Ward.name;

export type WardDocument = HydratedDocument<Ward>;

export const WardSchema = SchemaFactory.createForClass(Ward);

export const WardProvider: ModelDefinition = {
  name: WARD_SCHEMA,
  schema: WardSchema,
};
