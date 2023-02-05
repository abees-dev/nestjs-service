import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostProvider } from './entities/post.entity';
import { UserProvider } from '../user/entities/user.entity';
import { FeelingProvider } from './entities/feeling.entity';
import { FollowUserProvider } from '../follow-user/entities/follow-user.entity';
import { FriendProvider } from '../friend/entities/friend.entity';
import { FriendService } from '../friend/friend.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      PostProvider,
      UserProvider,
      FeelingProvider,
      FollowUserProvider,
      FriendProvider,
      UserProvider,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, FriendService],
})
export class PostModule {}
