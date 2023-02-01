import { Injectable } from '@nestjs/common';
import { CreateFollowUserDto } from './dto/create-follow.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FOLLOW_USER_SCHEMA, FollowUserDocument } from './entities/follow-user.entity';
import { Model } from 'mongoose';
import { USER_SCHEMA, UserDocument } from '../user/entities/user.entity';

@Injectable()
export class FollowUserService {
  constructor(
    @InjectModel(FOLLOW_USER_SCHEMA) private followUserModel: Model<FollowUserDocument>,
    @InjectModel(USER_SCHEMA) private userDocument: Model<UserDocument>,
  ) {}

  async create(createFollowUserDto: CreateFollowUserDto) {
    const { user_id, target_id } = createFollowUserDto;
    const existsFollow = await this.followUserModel.findOne({
      user_id: target_id,
      follower_id: user_id,
    });

    if (!existsFollow) {
      const newFollow = new this.followUserModel({
        user_id: target_id,
        follower_id: user_id,
      });

      await newFollow.save();

      await this.userDocument.findByIdAndUpdate(target_id, { $inc: { no_of_followers: 1 } });
    }
  }
}
