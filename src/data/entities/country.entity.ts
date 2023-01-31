import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Country {
  @Prop({
    type: Number,
    required: true,
    unique: true,
  })
  country_id: number;

  @Prop({
    type: String,
    required: true,
    default: '',
  })
  country_name: string;

  @Prop({
    type: String,
    required: true,
    default: '',
  })
  country_slug: string;
}

export const COUNTRY_SCHEMA = Country.name;

export type CountryDocument = HydratedDocument<Country>;

export const CountrySchema = SchemaFactory.createForClass(Country);

export const CountryProvider: ModelDefinition = {
  name: COUNTRY_SCHEMA,
  schema: CountrySchema,
};
