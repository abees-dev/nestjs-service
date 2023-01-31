import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Country } from './country.entity';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class City {
  @Prop({
    type: Number,
    required: true,
    unique: true,
  })
  city_id: number;

  @Prop({ type: Number, required: true })
  country_id: number;

  @Prop({
    type: String,
    required: true,
  })
  city_name: string;

  @Prop({
    type: String,
    default: '',
  })
  city_slug: string;
}

export const CITY_SCHEMA = City.name;

export type CityDocument = HydratedDocument<City>;

export const CitySchema = SchemaFactory.createForClass(City);

export const CityProvider: ModelDefinition = {
  name: CITY_SCHEMA,
  schema: CitySchema,
};
