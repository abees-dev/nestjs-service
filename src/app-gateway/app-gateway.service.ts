import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { AUTH_SERVICE, MICRO_SERVICE, REDIS_CONNECTION, REDIS_SERVICE } from '../contrains';
import { RedisService } from '../redis/redis.service';
import { AuthService } from '../auth/auth.service';
import { UserConnection } from '../types/connection.redis';
import { InjectModel } from '@nestjs/mongoose';
import { MESSAGE_SCHEMA, MessageDocument } from '../message/entities/message.entity';
import { Model } from 'mongoose';
import { MessageDto } from './dto/create-app-gateway.dto';
import { CONVERSATION_SCHEMA, ConversationDocument } from '../conversation/entities/conversation.entity';
import { CatchError, ExceptionResponse } from '../utils/utils.error';
import { MessageResponse } from '../response/message.response';
import { CONVERSATION_MEMBER_SCHEMA, ConversationMemberDocument } from '../conversation/entities/conversation.member';
import { MESSAGE_REMOVE_SCHEMA, MessageRemoveDocument } from '../message/entities/message-remove.entity';
import { MessageRemoveDto } from '../message/dto/message-remove.dto';
import { verifyObjectId } from '../utils/util.objectId';
import { PayloadNotificationDto } from '../notification/dto/payload-notification.dto';
import { MESSAGE_PATTERN, NOTIFICATION_TYPE } from '../enum';
import { Microservice } from '../microservice/micro.service';
import { isEmpty } from 'lodash';

@Injectable()
export class AppGatewayService {
  private logger = new Logger(AppGatewayService.name);

  constructor(
    @Inject(REDIS_SERVICE) private redisService: RedisService,
    @Inject(AUTH_SERVICE) private authService: AuthService,
    @InjectModel(MESSAGE_SCHEMA) private messageModel: Model<MessageDocument>,
    @InjectModel(MESSAGE_REMOVE_SCHEMA) private messageRemoveModel: Model<MessageRemoveDocument>,
    @InjectModel(CONVERSATION_SCHEMA) private conversationModel: Model<ConversationDocument>,
    @InjectModel(CONVERSATION_MEMBER_SCHEMA) private conversationMemberModel: Model<ConversationMemberDocument>,
    @Inject(MICRO_SERVICE) private microservice: Microservice,
  ) {}

  async handleMessage(user_id: string, payload: MessageDto, type: number) {
    try {
      const conversation = await this.conversationModel.findOne({
        _id: payload.conversation_id,
        members: { $all: [user_id] },
      });
      if (!conversation) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Conversation not found');
      }

      const { message_reply_id, ...rest } = payload;

      const checkMessageId = verifyObjectId(message_reply_id);

      const message = new this.messageModel({
        ...rest,
        user_id,
        type,
        ...(checkMessageId && { message_reply_id }),
      });
      await message.save();
      conversation.last_message = message._id.toString();
      await Promise.all([
        this.conversationMemberModel.findOneAndUpdate(
          {
            conversation_id: payload.conversation_id,
            user_id,
          },
          {
            last_seen_message: message._id,
            no_of_not_seen: 0,
          },
        ),
        conversation.save(),
      ]);
      const messageResponse = await this.messageModel.aggregate([
        {
          $match: { _id: message._id },
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

      const connections = await this.redisService.get<UserConnection[]>(REDIS_CONNECTION);

      await Promise.all(
        conversation.members.map(async (item) => {
          if (item.toString() !== user_id) {
            await this.conversationMemberModel.findOneAndUpdate(
              {
                conversation_id: payload.conversation_id,
                user_id: item,
              },
              {
                $inc: { no_of_not_seen: 1 },
              },
            );
          }
        }),
      );

      const members = conversation.members.map((item) => item.toString());

      const filterConnection =
        connections?.filter(
          (connection) =>
            members.includes(connection.user_id) && connection.room_id == '' && connection.user_id !== user_id,
        ) || [];

      !isEmpty(filterConnection) &&
        __socket
          .to(filterConnection.map((item) => item.socket_id))
          .emit('last_message', new MessageResponse(messageResponse[0]));

      const useOffline = members.filter(
        (item) => item !== user_id && !filterConnection.map((item) => item.user_id).includes(item),
      );

      if (useOffline.length > 0) {
        this.microservice.send<PayloadNotificationDto>(MESSAGE_PATTERN.NOTIFY_PRIORITY_HANDLER, {
          user_id,
          notification_type: NOTIFICATION_TYPE.NEW_MESSAGE,
          avatar: messageResponse[0].user.full_name,
          object_id: payload.conversation_id,
          title: 'Message',
          content: `${messageResponse[0].user.full_name} đã gửi tin nhắn đến bạn`,
          name: messageResponse[0].user.full_name,
          user_ids: useOffline,
        });
      }

      return new MessageResponse(messageResponse[0]);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async handleConnection(token: string, socket_id: string) {
    try {
      const payload = await this.authService.verifyToken(token);

      if (!payload?.id) {
        throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'Invalid token');
      }

      const connections = await this.redisService.get<UserConnection[]>(REDIS_CONNECTION);

      const filterConnection = connections?.filter((connection) => connection.user_id !== payload.id) || [];

      await this.redisService.set(REDIS_CONNECTION, [
        ...filterConnection,
        {
          user_id: payload.id,
          socket_id,
          room_id: '',
        },
      ]);

      return {
        user_id: payload.id,
      };
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async handleDisconnect(socket_id: string) {
    try {
      const connections = await this.redisService.get<UserConnection[]>(REDIS_CONNECTION);

      const filterConnection = connections?.filter((connection) => connection.socket_id !== socket_id) || [];

      await this.redisService.set(REDIS_CONNECTION, filterConnection);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async handleJoinRoom(user_id: string, room_id: string) {
    try {
      const connections = await this.redisService.get<UserConnection[]>(REDIS_CONNECTION);

      const newConnection =
        connections?.map((connection) => ({ ...connection, ...(connection.user_id === user_id && { room_id }) })) || [];

      const conversation = await this.conversationModel.findById(room_id);
      if (!conversation) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Conversation not found');
      }

      await this.conversationMemberModel.findOneAndUpdate(
        {
          conversation_id: room_id,
          user_id,
        },
        {
          last_seen_message: conversation.last_message,
          no_of_not_seen: 0,
        },
      ),
        await this.redisService.set(REDIS_CONNECTION, newConnection);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async handleLeaveRoom(user_id: string) {
    try {
      const connections = await this.redisService.get<UserConnection[]>(REDIS_CONNECTION);

      const newConnection =
        connections?.map((connection) => ({ ...connection, ...(connection.user_id === user_id && { room_id: '' }) })) ||
        [];

      await this.redisService.set(REDIS_CONNECTION, newConnection);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
