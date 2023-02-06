import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FRIEND_SCHEMA, FriendDocument } from './entities/friend.entity';
import mongoose, { Model } from 'mongoose';
import { FOLLOW_USER_SCHEMA, FollowUserDocument } from '../follow-user/entities/follow-user.entity';
import { CatchError, ExceptionResponse } from '../utils/utils.error';
import { BOOLEAN, CONTACT_TYPE, MESSAGE_PATTERN, NOTIFICATION_TYPE } from '../enum';
import { BaseResponse } from '../response';
import { FriendResponse } from '../response/friend.response';
import { USER_SCHEMA, UserDocument } from '../user/entities/user.entity';
import { MICRO_SERVICE } from '../contrains';
import { Microservice } from '../microservice/micro.service';
import { PayloadNotificationDto } from '../notification/dto/payload-notification.dto';
import { UserResponse } from '../response/user.response';
import { GetSuggestionsQuery } from './dto/query.friend.dto';
import { orderQuery } from '../utils/util.order.query';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(FRIEND_SCHEMA) private friendDocument: Model<FriendDocument>,
    @InjectModel(FOLLOW_USER_SCHEMA) private followUserDocumentDocument: Model<FollowUserDocument>,
    @InjectModel(USER_SCHEMA) private userDocumentModel: Model<UserDocument>,
    @Inject(MICRO_SERVICE) private microservice: Microservice,
  ) {}

  async addFriend(user_id: string, target_id: string) {
    try {
      const existsFriend = await this.friendDocument.findOne({
        sender_id: {
          $in: [user_id, target_id],
        },
        receiver_id: {
          $in: [user_id, target_id],
        },
      });

      if (!existsFriend) {
        const newFriend = new this.friendDocument({ sender_id: user_id, receiver_id: target_id });

        await newFriend.save();

        this.microservice.send(MESSAGE_PATTERN.ADD_NEW_FOLLOWER, { user_id, target_id });

        const user = await this.userDocumentModel.findById(user_id);

        this.microservice.send<PayloadNotificationDto>(MESSAGE_PATTERN.NOTIFY_PRIORITY_HANDLER, {
          user_id,
          notification_type: NOTIFICATION_TYPE.SEND_FRIEND,
          avatar: user.avatar,
          object_id: target_id,
          title: 'Add friend',
          content: 'đã gửi lời mới kết bạn đến bạn',
          name: user.full_name,
        });

        return new BaseResponse({ message: 'Add friend successfully' });
      }

      if (existsFriend.status === BOOLEAN.TRUE) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'You are already friends');
      }

      if (existsFriend.sender_id.toString() === user_id) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'You have sent an invitation to this person');
      }

      if (existsFriend.receiver_id.toString() === user_id) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'You have received an invitation from this person');
      }
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async removeFriend(user_id: string, target_id: string) {
    try {
      const existsFriend = await this.friendDocument.findOne({
        sender_id: {
          $in: [user_id, target_id],
        },
        receiver_id: {
          $in: [user_id, target_id],
        },
        status: BOOLEAN.TRUE,
      });

      if (!existsFriend) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'You are not friends');
      }

      await this.friendDocument.deleteOne({
        _id: existsFriend._id,
      });
      this.microservice.send(MESSAGE_PATTERN.UPDATE_NO_OF_FRIEND, { user_id, target_id, method: 0 });

      return new BaseResponse({ message: 'Remove friend successfully' });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async revokeRequest(user_id: string, target_id: string) {
    try {
      const existsFriend = await this.friendDocument.findOne({
        sender_id: user_id,
        receiver_id: target_id,
        status: BOOLEAN.FALSE,
      });

      if (!existsFriend) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Request does not exist');
      }

      await this.friendDocument.deleteOne({
        _id: existsFriend._id,
      });

      return new BaseResponse({ message: 'Revoke request successfully' });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async acceptRequest(user_id: string, target_id: string) {
    try {
      const exitFriend = await this.friendDocument.findOne({
        sender_id: target_id,
        receiver_id: user_id,
        status: BOOLEAN.FALSE,
      });
      if (!exitFriend) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Request does not exist');
      }

      await this.friendDocument.findByIdAndUpdate(exitFriend._id, { status: BOOLEAN.TRUE });

      this.microservice.send(MESSAGE_PATTERN.ADD_NEW_FOLLOWER, { user_id, target_id });
      this.microservice.send(MESSAGE_PATTERN.UPDATE_NO_OF_FRIEND, { user_id, target_id, method: 1 });
      const user = await this.userDocumentModel.findById(user_id);

      this.microservice.send<PayloadNotificationDto>(MESSAGE_PATTERN.NOTIFY_PRIORITY_HANDLER, {
        user_id,
        notification_type: NOTIFICATION_TYPE.ACCEPT_FRIEND,
        avatar: user.avatar,
        object_id: target_id,
        title: 'accept friend',
        content: 'đã chấp nhận lời mới kết bạn của bạn',
        name: user.full_name,
      });
      return new BaseResponse({ message: 'Accept request successfully' });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async deniedRequest(user_id: string, target_id: string) {
    try {
      const exitFriend = await this.friendDocument.findOne({
        sender_id: target_id,
        receiver_id: user_id,
        status: BOOLEAN.FALSE,
      });
      if (!exitFriend) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Request does not exist');
      }
      await this.friendDocument.findByIdAndDelete(exitFriend._id);
      return new BaseResponse({ message: 'Denied request successfully' });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getFriend(user_id: string, target_id: string) {
    try {
      const existsFriend = await this.friendDocument.aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  { receiver_id: new mongoose.Types.ObjectId(target_id) },
                  { sender_id: new mongoose.Types.ObjectId(target_id) },
                ],
              },
              { status: BOOLEAN.TRUE },
            ],
          },
        },
        {
          $addFields: {
            user_id: {
              $cond: {
                if: { $eq: ['$sender_id', new mongoose.Types.ObjectId(target_id)] },
                then: '$receiver_id',
                else: '$sender_id',
              },
            },
          },
        },
        {
          $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      ]);
      const mapList = await Promise.all(
        existsFriend.map(async (item) => {
          const { type } = await this.contactType(user_id, item.user._id);
          return {
            ...new FriendResponse({
              ...item,
              user: item.user,
            }),
            contact_type: type,
          };
        }),
      );

      return new BaseResponse({ data: mapList });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getFriendRequest(user_id: string, query: GetSuggestionsQuery) {
    try {
      const numberLimit = Number(query?.limit) || 10;

      const requestFriend = await this.friendDocument
        .aggregate([
          {
            $match: {
              sender_id: new mongoose.Types.ObjectId(user_id),
              status: BOOLEAN.FALSE,
              ...(Number(query?.position) && { createdAt: { $lt: Number(query?.position) } }),
            },
          },
          {
            $lookup: { from: 'users', localField: 'receiver_id', foreignField: '_id', as: 'user' },
          },
          {
            $unwind: {
              path: '$user',
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .sort({ createdAt: -1 })
        .limit(numberLimit);

      if (!requestFriend) {
        return new BaseResponse({ data: [] });
      }

      const mapList = requestFriend.map((item: any) => {
        return new FriendResponse({
          ...item,
          contact_type: CONTACT_TYPE.REQUEST,
          user: item.user,
        });
      });
      return new BaseResponse({ data: mapList });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getFriendReceive(user_id: string, query?: GetSuggestionsQuery) {
    try {
      const numberLimit = Number(query?.limit) || 10;
      const requestFriend = await this.friendDocument
        .aggregate([
          {
            $match: {
              receiver_id: new mongoose.Types.ObjectId(user_id),
              status: BOOLEAN.FALSE,
              ...(Number(query?.position) && { createdAt: { $lt: Number(query?.position) } }),
            },
          },
          {
            $lookup: { from: 'users', localField: 'sender_id', foreignField: '_id', as: 'user' },
          },
          {
            $unwind: {
              path: '$user',
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .sort({ createdAt: -1 })
        .limit(numberLimit);

      if (!requestFriend) {
        return new BaseResponse({ data: [] });
      }
      const mapList = requestFriend.map((item: any) => {
        return new FriendResponse({
          ...item,
          contact_type: CONTACT_TYPE.PENDING,
          user: item.user,
        });
      });
      return new BaseResponse({ data: mapList });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getSuggestFriend(user_id: string, query: GetSuggestionsQuery) {
    try {
      const numberOfLimit = Number(query.limit) || 10;

      const suggestFriend = await this.userDocumentModel
        .aggregate([
          { $match: { _id: { $ne: new mongoose.Types.ObjectId(user_id) } } },
          { $lookup: { from: 'friends', localField: '_id', foreignField: 'sender_id', as: 'sender' } },
          { $lookup: { from: 'friends', localField: '_id', foreignField: 'receiver_id', as: 'receiver' } },
          {
            $match: {
              $and: [{ $expr: { $eq: [{ $size: '$sender' }, 0] } }, { $expr: { $eq: [{ $size: '$receiver' }, 0] } }],
              ...(Number(query.position) && { createdAt: orderQuery('desc', query.position) }),
            },
          },
        ])
        .sort({ createdAt: -1 })
        .limit(numberOfLimit);

      return new BaseResponse({
        data: suggestFriend.map((item) => ({
          ...new UserResponse(item),
          position: new Date(item.createdAt).getTime(),
        })),
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async contactType(user_id: string, target_id: string) {
    if (user_id === target_id.toString()) {
      return {
        type: CONTACT_TYPE.IT_ME,
      };
    }

    const existsFriend = await this.friendDocument.aggregate([
      {
        $match: {
          $or: [
            { sender_id: new mongoose.Types.ObjectId(user_id), receiver_id: new mongoose.Types.ObjectId(target_id) },
            { sender_id: new mongoose.Types.ObjectId(target_id), receiver_id: new mongoose.Types.ObjectId(user_id) },
          ],
        },
      },
      {
        $addFields: {
          type: {
            $cond: {
              if: { $eq: ['$status', BOOLEAN.TRUE] },
              then: CONTACT_TYPE.FRIEND,
              else: {
                $cond: {
                  if: { $eq: ['$sender_id', new mongoose.Types.ObjectId(user_id)] },
                  then: CONTACT_TYPE.REQUEST,
                  else: CONTACT_TYPE.PENDING,
                },
              },
            },
          },
        },
      },
    ]);

    if (existsFriend.length === 0) {
      return {
        type: CONTACT_TYPE.NONE,
      };
    } else {
      return {
        type: existsFriend[0].type,
      };
    }
  }
}
