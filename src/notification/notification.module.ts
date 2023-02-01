import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationProvider } from './entities/notification.entity';
import { PushTokenProvider } from './entities/push-token.entity';
import { FollowPostProvider } from '../follow-post/entities/follow-post.entity';
import { UserProvider } from '../user/entities/user.entity';
import { PostProvider } from '../post/entities/post.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      NotificationProvider,
      PushTokenProvider,
      FollowPostProvider,
      UserProvider,
      PostProvider,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
