import { Module } from '@nestjs/common';
import { FollowUserService } from './follow-user.service';
import { FollowUserController } from './follow-user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowUserProvider } from './entities/follow-user.entity';
import { UserProvider } from '../user/entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature([FollowUserProvider, UserProvider])],
  controllers: [FollowUserController],
  providers: [FollowUserService],
})
export class FollowUserModule {}
