import { HttpStatus, Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { POST_SCHEMA, PostDocument } from './entities/post.entity';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { CatchError, ExceptionResponse } from '../utils/utils.error';
import { GetPostQuery } from './dto/query.dto';
import { PostResponse } from 'src/response/post.response';
import { BaseResponse } from 'src/response';
import { BOOLEAN, MESSAGE_PATTERN, METHOD, VIEW } from 'src/enum';
import { isEmpty } from 'lodash';
import { USER_SCHEMA, UserDocument } from '../user/entities/user.entity';
import { MICRO_SERVICE } from '../contrains';
import { Microservice } from '../microservice/micro.service';
import { ReactionPostDto } from './dto/reaction-post.dto';
import { reactionArray } from '../enum/reaction';
import { FEELING_SCHEMA, FeelingDocument } from './entities/feeling.entity';
import { Format } from '../utils/utils.format';
import { FeelingResponse } from '../response/feeling.response';
import { FeelingQueryDto } from './dto/feeling-query.dto';
import { orderQuery } from 'src/utils/util.order.query';
import { FriendService } from '../friend/friend.service';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);

  constructor(
    @InjectModel(POST_SCHEMA) private postModel: Model<PostDocument>,
    @InjectModel(USER_SCHEMA) private userModel: Model<UserDocument>,
    @InjectModel(FEELING_SCHEMA) private feelingModel: Model<FeelingDocument>,
    @Inject(MICRO_SERVICE) private microservice: Microservice,
    private friendService: FriendService,
  ) {}

  async getFeeling(query: FeelingQueryDto) {
    const order = query?.order || 'asc';
    const limit = Number(query.limit) || 10;
    const feeling = await this.feelingModel
      .aggregate([
        {
          $match: {
            ...(query?.search && {
              search: {
                $regex: `.*${Format.searchString(query?.search)}.*`,
                $options: 'i',
              },
            }),
            ...(Number(query?.position) && {
              createdAt: orderQuery(order, query.position),
            }),
          },
        },
      ])
      .sort({
        createdAt: order,
      })
      .limit(limit);
    return new BaseResponse({ data: FeelingResponse.mapList(feeling) });
  }

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
      await post.save();

      const postResponse = await this.postModel.aggregate([
        {
          $match: { _id: post._id },
        },
        {
          $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' },
        },
        {
          $lookup: { from: 'users', localField: 'tag', foreignField: '_id', as: 'tag' },
        },
        {
          $lookup: { from: 'uploads', localField: 'medias', foreignField: '_id', as: 'medias' },
        },
        {
          $lookup: { from: 'feelings', localField: 'feeling_id', foreignField: '_id', as: 'feeling' },
        },
        {
          $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: { path: '$feeling', preserveNullAndEmptyArrays: true },
        },
      ]);

      this.microservice.send(MESSAGE_PATTERN.ADD_NEW_FOLLOW_POST, { user_id, post_id: post._id });
      return new BaseResponse({
        data: new PostResponse(postResponse[0]),
      });
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
            $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' },
          },
          {
            $lookup: { from: 'users', localField: 'tag', foreignField: '_id', as: 'tag' },
          },
          {
            $lookup: { from: 'uploads', localField: 'medias', foreignField: '_id', as: 'medias' },
          },
          {
            $lookup: {
              from: 'reactions',
              localField: '_id',
              foreignField: 'object_id',
              as: 'reactions',
              pipeline: [
                {
                  $match: { user_id: new mongoose.Types.ObjectId(user_id) },
                },
              ],
            },
          },
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'post_id',
              as: 'comments',
              pipeline: [
                {
                  $match: { deleted: BOOLEAN.FALSE, comment_reply_id: null },
                },
              ],
            },
          },
          {
            $lookup: { from: 'feelings', localField: 'feeling_id', foreignField: '_id', as: 'feeling' },
          },
          { $unwind: '$user' },
          {
            $unwind: { path: '$feeling', preserveNullAndEmptyArrays: true },
          },
          {
            $match: {
              $or: [
                { $and: [{ view: { $in: [0, 1] } }, { 'friendship.0': { $exists: true } }] },
                { $and: [{ view: 0 }, { 'friendship.0': { $exists: false } }] },
                { $and: [{ 'user._id': new mongoose.Types.ObjectId(user_id) }, { view: { $in: [0, 1, 2] } }] },
              ],
              ...(Number(query?.position) && { createdAt: { $lt: new Date(Number(query.position)) } }),
              deleted: BOOLEAN.FALSE,
            },
          },
          {
            $addFields: {
              no_of_comment: { $size: '$comments' },
              my_reaction: { $arrayElemAt: ['$reactions.type', 0] },
            },
          },
        ])
        .sort({ createdAt: -1 })
        .limit(numberOfLimit);

      const mapList = await Promise.all(
        data.map(async (post) => {
          const { type } = await this.friendService.contactType(user_id, post.user._id);
          return new PostResponse({
            ...post,
            user: {
              ...post.user,
              contact_type: type,
            },
          });
        }),
      );

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

  async handlerReactionPost(payload: ReactionPostDto) {
    try {
      const { method, post_id, type } = payload;
      const existPost = await this.postModel.findOne({ _id: post_id, deleted: BOOLEAN.FALSE });
      if (!existPost) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Post not found');

      const reactionType = reactionArray[type - 1];

      console.log(reactionType);
      console.log(payload);

      if (payload?.old_type) {
        const oldReactionType = reactionArray[payload.old_type - 1];
        await this.postModel.findByIdAndUpdate(post_id, { $inc: { [oldReactionType]: -1, [reactionType]: 1 } });
        return;
      }
      const inc = method === METHOD.ADD ? 1 : -1;
      await this.postModel.findByIdAndUpdate(post_id, { $inc: { [reactionType]: inc, no_of_reaction: inc } });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
