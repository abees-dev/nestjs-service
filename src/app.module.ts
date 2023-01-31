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
  ],
})
export class AppModule {}
