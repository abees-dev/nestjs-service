import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { IRequest } from '../types/context';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentDto, RemoveCommentDto } from './dto/params-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
@ApiTags('Comment Controller')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':post_id')
  @ApiBearerAuth()
  async getComments(@Req() req: IRequest, @Param() param: GetCommentDto, @Query() queryCommentDto: QueryCommentDto) {
    return await this.commentService.getComments(req.user_id, param.post_id, queryCommentDto);
  }

  @Post('create')
  @ApiBearerAuth()
  async createComment(@Body() createCommentDto: CreateCommentDto, @Req() req: IRequest) {
    return await this.commentService.createComment(req.user_id, createCommentDto);
  }

  @Post('remove/:comment_id')
  @ApiBearerAuth()
  async removeComment(@Req() req: IRequest, @Param() param: RemoveCommentDto) {
    return await this.commentService.removeComment(req.user_id, param.comment_id);
  }

  @Post('update')
  @ApiBearerAuth()
  async updateComment(@Req() req: IRequest, @Body() updateCommentDto: UpdateCommentDto) {
    return await this.commentService.updateComment(req.user_id, updateCommentDto);
  }
}
