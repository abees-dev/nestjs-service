import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../user/entities/user.entity';

@Schema({
  timestamps: true,
})
export class Post {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({
    type: Number,
    default: 0, // 0: public, 1: private (only friends), 2: only me
  })
  view: number;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
  })
  medias: string[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
  })
  tag: User[];

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_reaction: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_like: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_love: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_wow: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_haha: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_sad: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_angry: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_dear: number;

  @Prop({
    type: Number,
    default: 0,
  })
  no_of_shares: number;

  @Prop({
    type: Number,
    default: 0, // 0:
  })
  status: number;

  @Prop({
    type: String,
    default: '',
  })
  caption: string;

  @Prop({
    type: String,
    default: '',
  })
  location: string;

  @Prop({
    type: Number,
    default: 0,
  })
  deleted: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  feeling_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  parent_id: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export const POST_SCHEMA = Post.name;

export type PostDocument = HydratedDocument<Post>;

export const PostProvider: ModelDefinition = {
  name: POST_SCHEMA,
  schema: PostSchema,
};
