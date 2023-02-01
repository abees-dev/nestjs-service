import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowUserService } from './follow-user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERN } from '../enum';
import { CreateFollowUserDto } from './dto/create-follow.dto';

@Controller('follow-user')
export class FollowUserController {
  constructor(private readonly followUserService: FollowUserService) {}

  @MessagePattern(MESSAGE_PATTERN.ADD_NEW_FOLLOWER)
  async addNewFollower(@Payload() createFollowUserDto: CreateFollowUserDto) {
    return this.followUserService.create(createFollowUserDto);
  }
}
