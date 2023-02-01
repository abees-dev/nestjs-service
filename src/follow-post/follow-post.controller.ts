import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FollowPostService } from './follow-post.service';
import { CreateFollowPostDto } from './dto/create-follow-post.dto';
import { UpdateFollowPostDto } from './dto/update-follow-post.dto';
import { MESSAGE_PATTERN } from '../enum';

@Controller()
export class FollowPostController {
  constructor(private readonly followPostService: FollowPostService) {}

  @MessagePattern(MESSAGE_PATTERN.ADD_NEW_FOLLOW_POST)
  async addNewFollowPost(@Payload() createFollowPostDto: CreateFollowPostDto) {
    console.log('addNewFollowPost', createFollowPostDto);
    await this.followPostService.create(createFollowPostDto);
  }
}
