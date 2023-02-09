import { HttpStatus, Injectable } from '@nestjs/common';
import { MessageRemoveDto } from './dto/message-remove.dto';
import { CatchError, ExceptionResponse } from '../utils/utils.error';
import { InjectModel } from '@nestjs/mongoose';
import { MESSAGE_SCHEMA, MessageDocument } from './entities/message.entity';
import mongoose, { Model, Schema } from 'mongoose';
import { MESSAGE_REMOVE_SCHEMA, MessageRemoveDocument } from './entities/message-remove.entity';
import { CONVERSATION_SCHEMA, ConversationDocument } from '../conversation/entities/conversation.entity';
import { QueryMessageDto } from './dto/query.message.dto';
import { BaseResponse } from '../response';
import { MessageResponse } from '../response/message.response';
import { orderQuery } from 'src/utils/util.order.query';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(MESSAGE_SCHEMA) private messageModel: Model<MessageDocument>,
    @InjectModel(MESSAGE_REMOVE_SCHEMA) private messageRemoveModel: Model<MessageRemoveDocument>,
    @InjectModel(CONVERSATION_SCHEMA) private conversationModel: Model<ConversationDocument>,
  ) {}

  async removeMessage(user_id: string, payload: MessageRemoveDto) {
    try {
      const [conversation, message, messageRemove] = await Promise.all([
        this.conversationModel.findOne({ _id: payload.conversation_id, members: { $all: [user_id] } }),
        this.messageModel.findById(payload.message_id),
        this.messageRemoveModel.findOne({
          conversation_id: payload.conversation_id,
          user_id,
          message_id: payload.message_id,
        }),
      ]);

      if (!conversation) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Conversation  not found');
      }

      if (!message) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Message not found');
      }

      if (messageRemove) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Message already removed');
      }

      const messageRemoveModel = new this.messageRemoveModel({
        conversation_id: payload.conversation_id,
        user_id,
        message_id: payload.message_id,
      });

      await messageRemoveModel.save();

      return new BaseResponse({
        message: 'Message removed',
        data: {
          message_id: payload.message_id,
          conversation_id: payload.conversation_id,
        },
      });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async getMessages(user_id: string, conversation_id: string, queryMessageDto: QueryMessageDto) {
    try {
      const conversation = await this.conversationModel.findOne({
        _id: conversation_id,
        members: { $all: [user_id] },
      });

      if (!conversation) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Conversation not found');
      }

      const { limit } = queryMessageDto;

      const order = queryMessageDto?.order || 'desc';

      const numberOfLimit = Number(limit) || 10;

      const messages = await this.messageModel
        .aggregate([
          {
            $match: {
              conversation_id: new mongoose.Types.ObjectId(conversation_id),
            },
          },
          {
            $lookup: {
              from: 'message_removes',
              localField: '_id',
              foreignField: 'message_id',
              as: 'message_removes',
              pipeline: [{ $match: { user_id: new mongoose.Types.ObjectId(user_id) } }],
            },
          },
          {
            $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' },
          },
          {
            $lookup: { from: 'users', localField: 'tag', foreignField: '_id', as: 'tag' },
          },
          {
            $lookup: { from: 'uploads', localField: 'medias', foreignField: '_id', as: 'medias' },
          },
          {
            $addFields: {
              user: { $arrayElemAt: ['$user', 0] },
            },
          },
          {
            $match: {
              message_removes: { $size: 0 },
              ...(Number(queryMessageDto?.position) && {
                createdAt: orderQuery(order, queryMessageDto.position),
              }),
            },
          },
        ])
        .sort({ createdAt: order })
        .limit(numberOfLimit);

      const mapList = await Promise.all(
        messages.map(async (message) => {
          const parent = message.message_reply_id ? await this.getReplyMessages(message.message_reply_id) : null;
          return {
            ...new MessageResponse(message),
            message_parent: parent ? new MessageResponse(parent) : null,
          };
        }),
      );

      return new BaseResponse({
        data: mapList,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getReplyMessages(message_reply_id: string) {
    const messageResponse = await this.messageModel.aggregate([
      {
        $match: { _id: message_reply_id },
      },
      {
        $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' },
      },
      {
        $lookup: { from: 'users', localField: 'tag', foreignField: '_id', as: 'tag' },
      },
      {
        $lookup: { from: 'uploads', localField: 'medias', foreignField: '_id', as: 'medias' },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$user', 0] },
        },
      },
    ]);

    return messageResponse[0];
  }
}
