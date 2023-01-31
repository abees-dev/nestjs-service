import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { POST_SCHEMA, PostDocument } from './entities/post.entity';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { CatchError, ExceptionResponse } from '../utils/utils.error';
import { GetPostQuery } from './dto/query.dto';
import { handelPagination } from 'src/utils/util.pagination';
import { PostResponse } from 'src/response/post.response';
import { UserResponse } from 'src/response/user.response';
import { BaseResponse } from 'src/response';
import { BOOLEAN, VIEW } from 'src/enum';
import { isEmpty } from 'lodash';
import { USER_SCHEMA, UserDocument } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(POST_SCHEMA) private postModel: Model<PostDocument>,
    @InjectModel(USER_SCHEMA) private userModel: Model<UserDocument>,
  ) {}

  async createPost(user_id: string, createPostDto: CreatePostDto) {
    try {
      if (!isEmpty(createPostDto.tag)) {
        const userTag = await this.userModel.find({
          _id: { $in: createPostDto.tag },
        });

        if (userTag.length !== createPostDto.tag.length) {
          throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'User tag not found');
        }
      }
      const post = new this.postModel({
        ...createPostDto,
        user: user_id,
      });
      return await post.save();
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async getPost(user_id: string, query: GetPostQuery) {
    try {
      const { limit } = query;

      const numberOfLimit = Number(limit);

      const data = await this.postModel
        .aggregate([
          {
            $lookup: {
              from: 'friends',
              let: { userId: '$user' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $and: [{ $eq: ['$receiver_id', '$$userId'] }, { $eq: ['$status', 1] }] },
                        {
                          $or: [
                            {
                              $and: [
                                { $eq: ['$sender_id', new mongoose.Types.ObjectId(user_id)] },
                                { $eq: ['$status', 1] },
                              ],
                            },
                            {
                              $and: [
                                { $eq: ['$receiver_id', new mongoose.Types.ObjectId(user_id)] },
                                {
                                  $eq: ['$status', 1],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'friendship',
            },
          },
          {
            $match: {
              $or: [
                { $and: [{ view: { $in: [0, 1] } }, { 'friendship.0': { $exists: true } }] },
                { $and: [{ view: 0 }, { 'friendship.0': { $exists: false } }] },
                { $and: [{ user: { $ne: new mongoose.Types.ObjectId(user_id) } }, { view: 0 }] },
              ],
              ...(Number(query?.position) && { createdAt: { $lt: new Date(Number(query.position)) } }),
              deleted: BOOLEAN.FALSE,
            },
          },
        ])
        .limit(numberOfLimit)
        .sort({ createdAt: -1 })
        .lookup({ from: 'users', localField: 'user', foreignField: '_id', as: 'user' })
        .lookup({ from: 'users', localField: 'tag', foreignField: '_id', as: 'tag' })
        .lookup({ from: 'uploads', localField: 'medias', foreignField: '_id', as: 'medias' });

      const mapList = data.map((item) => {
        return {
          ...new PostResponse(item),
          user: new UserResponse(item.user[0]),
          position: new Date(item.createdAt).getTime(),
        };
      });

      return new BaseResponse({ data: mapList });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async deletePost(id: string, user_id: string) {
    try {
      const existPost = await this.postModel.findOne({ _id: id, user: user_id, deleted: BOOLEAN.FALSE });
      if (!existPost) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Post not found');

      existPost.deleted = BOOLEAN.TRUE;
      await existPost.save();

      return new BaseResponse({ message: 'Delete post successfully' });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async updatePost(id: string, user_id: string, createPostDto: CreatePostDto) {
    try {
      const existPost = await this.postModel.findOne({ _id: id, deleted: BOOLEAN.FALSE });

      if (!existPost) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Post not found');

      if (existPost.user.toString() !== user_id) {
        throw new ExceptionResponse(HttpStatus.FORBIDDEN, 'You are not allowed to do this action');
      }

      if (!isEmpty(createPostDto.tag)) {
        const userTag = await this.userModel.find({
          _id: { $in: createPostDto.tag },
        });

        if (userTag.length !== createPostDto.tag.length) {
          throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'User tag not found');
        }
      }

      await this.postModel.findByIdAndUpdate(id, {
        ...createPostDto,
      });
      return new BaseResponse({ message: 'Update post successfully' });
    } catch (error) {
      throw new CatchError(error);
    }
  }
}
