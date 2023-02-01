import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { COMMENT_SCHEMA, CommentDocument } from './entities/comment.entity';
import mongoose, { Model } from 'mongoose';
import { CatchError, ExceptionResponse } from '../utils/utils.error';
import { verifyObjectId } from '../utils/util.objectId';
import { BaseResponse } from '../response';
import { BOOLEAN } from '../enum';
import { POST_SCHEMA, PostDocument } from '../post/entities/post.entity';
import { QueryCommentDto } from './dto/query-comment.dto';
import { CommentResponse } from '../response/comment.response';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(COMMENT_SCHEMA) private commentDocument: Model<CommentDocument>,
    @InjectModel(POST_SCHEMA) private postDocument: Model<PostDocument>,
  ) {}

  async createComment(user_id: string, createCommentDto: CreateCommentDto) {
    try {
      const { comment_reply_id, media, ...rest } = createCommentDto;

      const existPost = await this.postDocument.findOne({
        _id: new mongoose.Types.ObjectId(rest.post_id),
        deleted: BOOLEAN.FALSE,
      });

      if (!existPost) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Post not found');

      const validReplyId = verifyObjectId(comment_reply_id);

      if (validReplyId) {
        const exitsComment = await this.commentDocument.findById(comment_reply_id);
        if (!exitsComment) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Comment not found');
      }

      const comment = new this.commentDocument({
        ...rest,
        user_id,
        ...(validReplyId && { comment_reply_id }),
        ...(verifyObjectId(media) && { media }),
      });

      await comment.save();

      return new BaseResponse({
        data: {
          comment_id: comment._id,
        },
      });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async getComments(user_id: string, post_id: string, queryCommentDto: QueryCommentDto) {
    try {
      const existPost = await this.postDocument.findById(post_id);
      if (!existPost) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Post not found');

      const { limit, comment_id } = queryCommentDto;
      const limitOfNumber = Number(limit) || 10;

      const comments = await this.commentDocument
        .aggregate([
          {
            $match: {
              post_id: new mongoose.Types.ObjectId(post_id),
              deleted: BOOLEAN.FALSE,
              comment_reply_id: comment_id ? new mongoose.Types.ObjectId(comment_id) : null,
            },
          },
          {
            $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' },
          },
          {
            $lookup: { from: 'comments', localField: '_id', foreignField: 'comment_reply_id', as: 'reply' },
          },
          {
            $lookup: { from: 'uploads', localField: 'media', foreignField: '_id', as: 'media' },
          },
          {
            $lookup: { from: 'users', localField: 'tag', foreignField: '_id', as: 'tag' },
          },
          {
            $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
          },
          {
            $unwind: { path: '$media', preserveNullAndEmptyArrays: true },
          },
          {
            $addFields: {
              no_of_reply: { $size: '$reply' },
            },
          },
          {
            $match: {
              ...(Number(queryCommentDto?.position) && {
                createdAt: { $lt: new Date(Number(queryCommentDto.position)) },
              }),
            },
          },
        ])
        .sort({ createdAt: -1 })
        .limit(limitOfNumber);

      return new BaseResponse({
        data: CommentResponse.mapList(comments),
      });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async removeComment(user_id: string, comment_id: string) {
    try {
      const existComment = await this.commentDocument.findOne({
        _id: new mongoose.Types.ObjectId(comment_id),
        user_id: new mongoose.Types.ObjectId(user_id),
        deleted: BOOLEAN.FALSE,
      });

      if (!existComment) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Comment not found');

      await this.commentDocument.updateOne(
        { _id: new mongoose.Types.ObjectId(comment_id) },
        { $set: { deleted: BOOLEAN.TRUE } },
      );

      return new BaseResponse({ message: 'Remove comment successfully' });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async updateComment(user_id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const { comment_id, media, ...res } = updateCommentDto;
      const existComment = await this.commentDocument.findById(comment_id);

      if (!existComment) throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'Comment not found');

      if (existComment.user_id.toString() !== user_id)
        throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized');

      await this.commentDocument.findByIdAndUpdate(comment_id, {
        $set: { ...res, ...(verifyObjectId(media) && { media }) },
      });

      return new BaseResponse({ message: 'Update comment successfully' });
    } catch (e) {
      throw new CatchError(e);
    }
  }
}
