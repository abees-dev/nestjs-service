import { HttpStatus, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import firebaseAdmin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../../firebase-cert.json';
import { DeleteDeviceDto, RegisterDeviceDto } from './dto/register-device.dto';
import { CatchError, ExceptionResponse } from '../utils/utils.error';
import { InjectModel } from '@nestjs/mongoose';
import { PUSH_TOKEN_SCHEMA, PushTokenDocument } from './entities/push-token.entity';
import mongoose, { Model } from 'mongoose';
import { BaseResponse } from '../response';
import { PayloadNotificationDto } from './dto/payload-notification.dto';
import { NOTIFICATION_SCHEMA, NotificationDocument } from './entities/notification.entity';
import { FOLLOW_POST_SCHEMA, FollowPostDocument } from '../follow-post/entities/follow-post.entity';
import { USER_SCHEMA, UserDocument } from '../user/entities/user.entity';
import { POST_SCHEMA, PostDocument } from '../post/entities/post.entity';
import { isEmpty } from 'lodash';
import { NOTIFICATION_TYPE } from '../enum';
import { QueryNotificationDto } from './dto/query.notification.dto';
import { orderQuery } from '../utils/util.order.query';
import { NotificationResponse } from '../response/NotificationResponse';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService implements OnApplicationBootstrap {
  private firebaseAdmin: firebaseAdmin.app.App;
  private logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(PUSH_TOKEN_SCHEMA) private pushTokenDocument: Model<PushTokenDocument>,
    @InjectModel(NOTIFICATION_SCHEMA) private notificationDocument: Model<NotificationDocument>,
    @InjectModel(FOLLOW_POST_SCHEMA) private followPostMode: Model<FollowPostDocument>,
    @InjectModel(USER_SCHEMA) private userDocument: Model<UserDocument>,
    @InjectModel(POST_SCHEMA) private postModel: Model<PostDocument>,
  ) {}

  async onApplicationBootstrap() {
    try {
      this.firebaseAdmin = await firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
      });
    } catch (e) {
      this.logger.warn(e);
    }
  }

  async getFollowPost(user_id: string, post_id: string) {
    const exitFollow = await this.followPostMode.aggregate([
      {
        $match: {
          post_id: new mongoose.Types.ObjectId(post_id),
          user_id: { $ne: new mongoose.Types.ObjectId(user_id) },
        },
      },
      {
        $lookup: { from: 'push_tokens', localField: 'user_id', foreignField: 'user_id', as: 'push_token' },
      },
      {
        $addFields: { push_token: '$push_token.push_token' },
      },
      {
        $project: { push_token: 1, user_id: 1 },
      },
    ]);

    return exitFollow;
  }

  get firebaseStore() {
    return this.firebaseAdmin;
  }

  async registerDevice(registerDeviceDto: RegisterDeviceDto) {
    try {
      const { push_token, device_id, user_id, platform } = registerDeviceDto;
      const exitDevice = await this.pushTokenDocument.findOne({ user_id, device_id });

      if (exitDevice) {
        await this.pushTokenDocument.findByIdAndUpdate(exitDevice._id, { push_token });
        return new BaseResponse({
          message: 'Register device success',
        });
      } else {
        const newPushToken = new this.pushTokenDocument({
          user_id,
          push_token,
          device_id,
          platform: platform || '',
        });
        await newPushToken.save();

        return new BaseResponse({
          message: 'Register device success',
        });
      }
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async deleteDevice(deleteDeviceDto: DeleteDeviceDto) {
    try {
      await this.pushTokenDocument.findOneAndDelete({
        user_id: deleteDeviceDto.user_id,
        device_id: deleteDeviceDto.device_id,
      });
      return new BaseResponse({});
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async notifyHandlerSingle(payload: PayloadNotificationDto) {
    try {
      const { user_id, title, content, notification_type, object_id, avatar } = payload;
      const pushToken = await this.pushTokenDocument.findOne({
        user_id: new mongoose.Types.ObjectId(object_id),
      });
      const user = await this.userDocument.findById(user_id);

      pushToken?.push_token &&
        (await this.firebaseAdmin.messaging().sendToDevice(pushToken?.push_token, {
          notification: {
            title,
            body: `${user.full_name} ${content}`,
            icon: `http://13.215.193.218:3009/${avatar}`,
          },
          data: {
            notification_type: notification_type.toString(),
            object_id: object_id,
            user_id: user_id,
            title,
            avatar: `http://13.215.193.218:3009/${avatar}`,
            content: content,
            name: user.full_name,
          },
        }));

      await new this.notificationDocument({
        user_id: object_id,
        title,
        content,
        notification_type,
        object_id: user_id,
        avatar,
        name: user.full_name,
      }).save();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async notifyHandlerCommentPost(payload: PayloadNotificationDto) {
    try {
      const { user_id, title, content, notification_type, object_id, avatar } = payload;
      const followPost = await this.getFollowPost(user_id, object_id);

      const post: any = await this.postModel.findById(object_id).populate('user');

      const user = await this.userDocument.findById(user_id);

      await Promise.all(
        followPost.map(async (item) => {
          const newContent = `${this.handleContentNotification(notification_type)} ${
            post.user._id.toString() !== item.user_id.toString() ? post?.user.full_name : 'bạn'
          }`;

          await new this.notificationDocument({
            user_id: item.user_id,
            title,
            content: newContent,
            notification_type,
            object_id: object_id,
            avatar,
            name: post?.user.full_name,
          }).save();

          !isEmpty(item.push_token) &&
            item.push_token.map(async (token) => {
              await this.firebaseAdmin.messaging().sendToDevice(token, {
                notification: {
                  title,
                  body: `${user.full_name} ${newContent}`,
                  icon: `http://13.215.193.218:3009/public/resource/image/0e69de3682fb4efd9b571939eaa27f4f.jpeg`,
                },
                data: {
                  notification_type: notification_type.toString(),
                  object_id: object_id,
                  user_id: user_id,
                  title,
                  avatar: post.user?.avatar,
                  content: newContent,
                  name: user?.full_name,
                },
              });
            });
        }),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  handleContentNotification(notification_type: number) {
    switch (notification_type) {
      case NOTIFICATION_TYPE.COMMENT_POST:
        return 'đã bình luận bài viết của ';
      case NOTIFICATION_TYPE.REACTION_POST:
        return 'đã bày tỏ cảm xúc về bài viết của';
      case NOTIFICATION_TYPE.REACTION_COMMENT:
        return 'đã bày tỏ cảm xúc về bình luận của';
    }
  }

  async getNotification(user_id: string, query: QueryNotificationDto) {
    try {
      const order = query?.order || 'desc';
      const numberOfLimit = Number(query?.limit) || 10;
      const notification = await this.notificationDocument
        .aggregate([
          {
            $match: {
              user_id: new mongoose.Types.ObjectId(user_id),
              ...(Number(query?.position) && {
                createdAt: orderQuery(order, query.position),
              }),
            },
          },
        ])
        .sort({ createdAt: order })
        .limit(numberOfLimit);
      return new BaseResponse({
        data: NotificationResponse.mapList(notification),
      });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async notifyMessage(payload: PayloadNotificationDto) {
    try {
      const { user_id, title, content, notification_type, object_id, avatar, user_ids } = payload;
      const pushToken = await this.pushTokenDocument.find({
        user_id: { $in: user_ids },
      });

      !isEmpty(pushToken) &&
        (await this.firebaseAdmin.messaging().sendMulticast({
          tokens: pushToken.map((item) => item.push_token),
          notification: {
            title,
            body: content,
          },
          data: {
            notification_type: notification_type.toString(),
            object_id: object_id,
            user_id: user_id,
            title,
            avatar: `https://upload.abeesdev.com/${avatar}`,
            content: content,
          },
        }));
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async readNotification(user_id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      if (updateNotificationDto.type === 1) {
        await this.notificationDocument.updateMany(
          {
            user_id: new mongoose.Types.ObjectId(user_id),
          },
          { is_read: true },
        );
        return new BaseResponse({});
      }

      if (!updateNotificationDto?.notification_id) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Missing params notification_id');
      }

      await this.notificationDocument.findOneAndUpdate(
        {
          notification_id: new mongoose.Types.ObjectId(updateNotificationDto.notification_id),
          user_id: new mongoose.Types.ObjectId(user_id),
        },
        { is_read: true },
      );
      return new BaseResponse({});
    } catch (e) {
      throw new CatchError(e);
    }
  }
}
