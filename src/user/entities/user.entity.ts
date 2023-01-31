import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { STRATEGY } from '../../enum/strategy';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  user_name: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    default: '',
    index: true,
  })
  first_name: string;

  @Prop({
    type: String,
    default: '',
    index: true,
  })
  last_name: string;

  @Prop({
    type: String,
    default: '',
    index: true,
  })
  full_name: string;

  @Prop({
    type: String,
    default: '',
    index: true,
  })
  phone: string;

  @Prop({
    type: String,
    default: '',
  })
  address: string;

  @Prop({
    type: Number,
    default: 0,
  })
  role: number;

  @Prop({
    type: Number,
    default: 1, // 1: active, 0: inactive
  })
  status: number;

  @Prop({
    type: String,
    default: '',
  })
  avatar: string;

  @Prop({
    type: Number,
    default: 0,
  })
  city_id: number;

  @Prop({
    type: Number,
    default: 0,
  })
  district_id: number;

  @Prop({
    type: Number,
    default: 0,
  })
  ward_id: number;

  @Prop({
    type: Number,
    default: 0,
    ref: 'Country',
  })
  country_id: number;

  @Prop({
    type: Date,
    default: null,
  })
  birthday: Date;

  @Prop({
    type: String,
    default: '',
  })
  thumb_nail: string;

  @Prop({
    type: Number,
    default: 0, // 0: no gender, 1: male, 2: female
  })
  gender: number;

  @Prop({
    type: Date,
    default: Date.now,
  })
  last_login: Date;

  @Prop({
    type: String,
    default: '',
  })
  github_id: string;

  @Prop({
    type: String,
    default: '',
  })
  facebook_id: string;

  @Prop({
    type: String,
    default: '',
  })
  google_id: string;

  @Prop({
    type: Number,
    default: STRATEGY.LOCAL, // 0: local, 1: facebook, 2: google, 3: github
  })
  strategy: number;

  @Prop({
    type: String,
    default: '',
    index: true,
  })
  search: string;

  @Prop({
    type: Number,
    default: 0,
  })
  lat: number;

  @Prop({
    type: Number,
    default: 0,
  })
  lng: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_friends: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_followers: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const USER_SCHEMA = User.name;

export type UserDocument = HydratedDocument<User>;

export const UserProvider: ModelDefinition = {
  name: USER_SCHEMA,
  schema: UserSchema,
};
