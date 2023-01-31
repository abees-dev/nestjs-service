import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowUserProvider } from '../follow-user/entities/follow-user.entity';
import { FriendProvider } from './entities/friend.entity';
import { UserProvider } from '../user/entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature([FollowUserProvider, FriendProvider, UserProvider])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
