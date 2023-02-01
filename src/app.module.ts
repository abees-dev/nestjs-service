import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config/config.service';
import { DataModule } from './data/data.module';
import { AuthModule } from './auth/auth.module';
import { FriendModule } from './friend/friend.module';
import { FollowUserModule } from './follow-user/follow-user.module';
import { PostModule } from './post/post.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { RedisModule } from './redis/redis.module';
import { AppGatewayModule } from './app-gateway/app-gateway.module';
import { CommentModule } from './comment/comment.module';
import { ReactionModule } from './reaction/reaction.module';
import { NotificationModule } from './notification/notification.module';
import { MicroModule } from './microservice/micro.module';
import { FollowPostModule } from './follow-post/follow-post.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.createMongooseOptions(),
      inject: [ConfigService],
    }),
    ConfigModule,
    DataModule,
    UserModule,
    AuthModule,
    FriendModule,
    FollowUserModule,
    PostModule,
    ConversationModule,
    MessageModule,
    RedisModule,
    AppGatewayModule,
    CommentModule,
    ReactionModule,
    NotificationModule,
    MicroModule,
    FollowPostModule,
  ],
})
export class AppModule {}
