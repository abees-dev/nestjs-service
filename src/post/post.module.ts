import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostProvider } from './entities/post.entity';
import { UserProvider } from '../user/entities/user.entity';
import { FeelingProvider } from './entities/feeling.entity';

@Module({
  imports: [MongooseModule.forFeature([PostProvider, UserProvider, FeelingProvider])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
