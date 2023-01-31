import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { IRequest } from '../types/context';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostQuery } from './dto/query.dto';
import { PostService } from './post.service';
import { DeletePostParamsDto } from './dto/deletepost-params.dto';
import { BaseResponse } from '../response';
import { PostResponseSwagger } from '../response/post.response';

@Controller('post')
@ApiTags('Post Controller')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: PostResponseSwagger,
    description: 'Get post',
    status: 200,
  })
  async getPost(@Req() req: IRequest, @Query() query: GetPostQuery) {
    return await this.postService.getPost(req.user_id, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: BaseResponse,
    description: 'Create post',
    status: 200,
  })
  async create(@Body() createPostDto: CreatePostDto, @Req() req: IRequest) {
    return await this.postService.createPost(req.user_id, createPostDto);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: BaseResponse,
    description: 'Update post',
    status: 200,
  })
  async updatePost(@Req() req: IRequest, @Param() params: DeletePostParamsDto, @Body() createPostDto: CreatePostDto) {
    return await this.postService.updatePost(params.id, req.user_id, createPostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: BaseResponse,
    description: 'Delete post',
    status: 200,
  })
  async deletePost(@Req() req: IRequest, @Param() params: DeletePostParamsDto) {
    return await this.postService.deletePost(params.id, req.user_id);
  }
}
