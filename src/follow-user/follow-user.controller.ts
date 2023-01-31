import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowUserService } from './follow-user.service';

@Controller('follow-user')
export class FollowUserController {
  constructor(private readonly followUserService: FollowUserService) {}
}
