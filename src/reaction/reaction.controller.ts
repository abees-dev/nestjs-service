import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { CreateReactionCommentDto, CreateReactionPostDto } from './dto/create-reaction.dto';
import { AuthGuard } from '../guards/auth.guard';
import { IRequest } from '../types/context';
import { ReactionPostPramDto } from './dto/param-reaction.dto';
import { QueryReactionDto } from './dto/query-reaction.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERN } from '../enum';
import { DetectReactionDto } from './dto/detect-reaction.dto';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @MessagePattern(MESSAGE_PATTERN.DETECT_REACTION)
  detectReaction(@Payload() payload: DetectReactionDto) {
    return this.reactionService.detectReaction(payload);
  }

  @Get(':post_id')
  @UseGuards(AuthGuard)
  getListReaction(@Req() req: IRequest, @Param() param: ReactionPostPramDto, @Query() query: QueryReactionDto) {
    return this.reactionService.getReactionPost(req.user_id, param.post_id, query);
  }

  @Post('post')
  @UseGuards(AuthGuard)
  create(@Req() req: IRequest, @Body() createReactionPostDto: CreateReactionPostDto) {
    return this.reactionService.createReactionPost(req.user_id, createReactionPostDto);
  }

  @Post('comment')
  @UseGuards(AuthGuard)
  createComment(@Req() req: IRequest, @Body() createReactionCommentDto: CreateReactionCommentDto) {
    return this.reactionService.createReactionComment(req.user_id, createReactionCommentDto);
  }
}
