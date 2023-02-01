import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentProvider } from './entities/comment.entity';
import { PostProvider } from '../post/entities/post.entity';

@Module({
  imports: [MongooseModule.forFeature([CommentProvider, PostProvider])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
