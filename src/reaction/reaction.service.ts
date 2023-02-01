import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateReactionCommentDto, CreateReactionPostDto } from './dto/create-reaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { REACTION_SCHEMA, ReactionDocument } from './entities/reaction.entity';
import mongoose, { Model } from 'mongoose';
import { CatchError, ExceptionResponse } from '../utils/utils.error';
import { BaseResponse } from '../response';
import { MICRO_SERVICE } from '../contrains';
import { Microservice } from '../microservice/micro.service';
import { BOOLEAN, MESSAGE_PATTERN, METHOD, NOTIFICATION_TYPE } from '../enum';
import { ReactionPostDto } from '../post/dto/reaction-post.dto';
import { POST_SCHEMA, PostDocument } from '../post/entities/post.entity';
import { QueryReactionDto } from './dto/query-reaction.dto';
import { ReactionResponse } from '../response/reaction.response';
import { COMMENT_SCHEMA, CommentDocument } from '../comment/entities/comment.entity';
import { PayloadNotificationDto } from '../notification/dto/payload-notification.dto';
import { DETECT_REACTION_SCHEMA, DetectReactionDocument } from './entities/detect-reaction.entity';
import { DetectReactionDto } from './dto/detect-reaction.dto';

@Injectable()
export class ReactionService {
  private logger = new Logger(ReactionService.name);

  constructor(
    @InjectModel(REACTION_SCHEMA) private reactionModel: Model<ReactionDocument>,
    @Inject(MICRO_SERVICE) private microservice: Microservice,
    @InjectModel(POST_SCHEMA) private postModel: Model<PostDocument>,
    @InjectModel(COMMENT_SCHEMA) private commentDocument: Model<CommentDocument>,
    @InjectModel(DETECT_REACTION_SCHEMA) private detectReactionDocument: Model<DetectReactionDocument>,
  ) {}

  async createReactionPost(user_id: string, reactionPostDto: CreateReactionPostDto) {
    try {
      const { post_id, type } = reactionPostDto;
      const existsPost = await this.postModel.findOne({ _id: post_id, deleted: BOOLEAN.FALSE });

      if (!existsPost) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Post not found');
      }

      const existReaction = await this.reactionModel.findOne({ user_id, object_id: post_id });

      const exitDetectReaction = await this.detectReactionDocument.findOne({ user_id, object_id: post_id });

      if (!exitDetectReaction && !existReaction) {
        this.microservice.send<PayloadNotificationDto>(MESSAGE_PATTERN.NOTIFY_PRIORITY_HANDLER, {
          user_id,
          notification_type: NOTIFICATION_TYPE.REACTION_POST,
          avatar: '',
          object_id: post_id,
          title: 'Notification',
          content: '',
          name: '',
        });
        this.microservice.send<DetectReactionDto>(MESSAGE_PATTERN.DETECT_REACTION, {
          user_id,
          object_id: post_id,
        });
      }

      if (!existReaction) {
        await this.reactionModel.create({ user_id, object_id: post_id, type });
        this.microservice.send<ReactionPostDto>(MESSAGE_PATTERN.REACTION_POST, {
          type,
          post_id: post_id,
          method: METHOD.ADD,
        });
        return new BaseResponse({});
      }
      if (existReaction.type === type) {
        this.microservice.send<ReactionPostDto>(MESSAGE_PATTERN.REACTION_POST, {
          type,
          post_id: post_id,
          method: METHOD.REMOVE,
        });
        await existReaction.remove();

        return new BaseResponse({});
      }

      this.microservice.send<ReactionPostDto>(MESSAGE_PATTERN.REACTION_POST, {
        type,
        post_id: post_id,
        method: METHOD.ADD,
        old_type: existReaction.type,
      });

      existReaction.type = type;
      await existReaction.save();
      return new BaseResponse({});
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async getReactionPost(user_id: string, post_id: string, query: QueryReactionDto) {
    try {
      const existPost = this.postModel.findOne({ _id: post_id, deleted: BOOLEAN.FALSE });
      if (!existPost) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Post not found');
      }
      const limit = Number(query?.limit) || 10;

      const listReaction = await this.reactionModel
        .aggregate([
          { $match: { object_id: new mongoose.Types.ObjectId(post_id) } },
          { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' } },
          { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },
          { $unwind: '$post' },
          {
            $match: {
              ...(Number(query?.type) && { type: Number(query?.type) }),
              ...(Number(query?.position) && { createdAt: { $lt: new Date(Number(query.position)) } }),
            },
          },
        ])
        .sort({ createdAt: -1 })
        .limit(limit);

      return new BaseResponse({
        data: ReactionResponse.mapList(listReaction),
      });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async createReactionComment(user_id: string, createReactionCommentDto: CreateReactionCommentDto) {
    try {
      const { comment_id, type } = createReactionCommentDto;
      const existComment = await this.commentDocument.findOne({ _id: comment_id, deleted: BOOLEAN.FALSE });

      if (!existComment) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Comment not found');
      }

      const existReaction = await this.reactionModel.findOne({ user_id, object_id: comment_id });
      if (!existReaction) {
        await this.reactionModel.create({ user_id, object_id: comment_id, type });
        this.microservice.send<ReactionPostDto>(MESSAGE_PATTERN.REACTION_COMMENT, {
          type,
          post_id: comment_id,
          method: METHOD.ADD,
        });
        return new BaseResponse({});
      }
      if (existReaction.type === type) {
        this.microservice.send<ReactionPostDto>(MESSAGE_PATTERN.REACTION_COMMENT, {
          type,
          post_id: comment_id,
          method: METHOD.REMOVE,
        });
        await existReaction.remove();

        return new BaseResponse({});
      }

      this.microservice.send<ReactionPostDto>(MESSAGE_PATTERN.REACTION_COMMENT, {
        type,
        post_id: comment_id,
        method: METHOD.ADD,
        old_type: existReaction.type,
      });

      existReaction.type = type;
      await existReaction.save();
      return new BaseResponse({});
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async detectReaction(payload: DetectReactionDto) {
    try {
      const { object_id, user_id } = payload;
      const exitDetect = await this.detectReactionDocument.findOne({ object_id, user_id });
      if (!exitDetect) {
        await this.detectReactionDocument.create({ object_id, user_id });
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
