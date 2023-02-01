import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReactionProvider } from './entities/reaction.entity';
import { PostProvider } from '../post/entities/post.entity';
import { CommentProvider } from '../comment/entities/comment.entity';
import { DetectReactionProvider } from './entities/detect-reaction.entity';

@Module({
  imports: [MongooseModule.forFeature([ReactionProvider, PostProvider, CommentProvider, DetectReactionProvider])],
  controllers: [ReactionController],
  providers: [ReactionService],
})
export class ReactionModule {}
