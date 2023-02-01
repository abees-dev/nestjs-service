import { Injectable } from '@nestjs/common';
import { CreateFollowPostDto } from './dto/create-follow-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FOLLOW_POST_SCHEMA, FollowPostDocument } from './entities/follow-post.entity';
import { Model } from 'mongoose';

@Injectable()
export class FollowPostService {
  constructor(@InjectModel(FOLLOW_POST_SCHEMA) private followPostMode: Model<FollowPostDocument>) {}

  async create(createFollowPostDto: CreateFollowPostDto) {
    try {
      const { user_id, post_id } = createFollowPostDto;
      const exitFollow = await this.followPostMode.findOne({ user_id, post_id });

      if (!exitFollow) {
        const newFollowPost = new this.followPostMode({
          user_id,
          post_id,
        });
        await newFollowPost.save();
      }
      return exitFollow;
    } catch (e) {
      console.log(e);
    }
  }
}
