import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class District {
  @Prop({
    type: Number,
    required: true,
    unique: true,
  })
  district_id: number;

  @Prop({
    type: String,
    required: true,
    default: '',
  })
  district_name: string;

  @Prop({
    type: String,
    required: true,
    default: '',
  })
  district_slug: string;

  @Prop({
    type: Number,
    required: true,
  })
  city_id: number;
}

export const DISTRICT_SCHEMA = District.name;

export type DistrictDocument = HydratedDocument<District>;

export const DistrictSchema = SchemaFactory.createForClass(District);

export const DistrictProvider: ModelDefinition = {
  name: DISTRICT_SCHEMA,
  schema: DistrictSchema,
};
