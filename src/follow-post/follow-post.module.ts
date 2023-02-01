import { Module } from '@nestjs/common';
import { FollowPostService } from './follow-post.service';
import { FollowPostController } from './follow-post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowPostProvider } from './entities/follow-post.entity';

@Module({
  imports: [MongooseModule.forFeature([FollowPostProvider])],
  controllers: [FollowPostController],
  providers: [FollowPostService],
})
export class FollowPostModule {}
