import { Controller, Get, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from '../guards/auth.guard';
import { AddFriendDto } from './dto/prams.dto';
import { IRequest } from '../types/context';
import { Response } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from '../response';
import { GetSuggestionsQuery } from './dto/query.friend.dto';

@Controller('friend')
@ApiTags('Friend Controller')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get('suggest')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getSuggestFriend(@Req() req: IRequest, @Query() query: GetSuggestionsQuery) {
    return await this.friendService.getSuggestFriend(req.user_id, query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @ApiResponse({})
  async getFriend(@Param() params: AddFriendDto, @Req() req: IRequest, @Res() res: Response) {
    const data = await this.friendService.getFriend(req.user_id, params.id);
    return res.status(HttpStatus.OK).json(data);
  }

  @Get('request/send')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @ApiResponse({})
  async getFriendRequest(@Req() req: IRequest, @Res() res: Response, @Query() query: GetSuggestionsQuery) {
    const data = await this.friendService.getFriendRequest(req.user_id, query);
    return res.status(HttpStatus.OK).json(data);
  }

  @Get('request/receive')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @ApiResponse({})
  async getFriendReceive(@Req() req: IRequest, @Res() res: Response) {
    const data = await this.friendService.getFriendReceive(req.user_id);
    return res.status(HttpStatus.OK).json(data);
  }

  @Post('add/:id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: BaseResponse,
  })
  @ApiBearerAuth()
  async addFriend(@Param() params: AddFriendDto, @Req() req: IRequest, @Res() res: Response) {
    const data = await this.friendService.addFriend(req.user_id, params.id);
    return res.status(HttpStatus.CREATED).json(data);
  }

  @Post('accept/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: BaseResponse,
  })
  async acceptRequest(@Param() params: AddFriendDto, @Req() req: IRequest, @Res() res: Response) {
    const data = await this.friendService.acceptRequest(req.user_id, params.id);
    return res.status(HttpStatus.OK).json(data);
  }

  @Post('revoke-request/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: BaseResponse,
  })
  async revokeRequest(@Param() params: AddFriendDto, @Req() req: IRequest, @Res() res: Response) {
    const data = await this.friendService.revokeRequest(req.user_id, params.id);
    return res.status(HttpStatus.OK).json(data);
  }

  @Post('remove/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: BaseResponse,
  })
  async removeFriend(@Param() params: AddFriendDto, @Req() req: IRequest, @Res() res: Response) {
    const data = await this.friendService.removeFriend(req.user_id, params.id);
    return res.status(HttpStatus.OK).json(data);
  }

  @Post('denied/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: BaseResponse,
  })
  async deniedRequest(@Param() params: AddFriendDto, @Req() req: IRequest, @Res() res: Response) {
    const data = await this.friendService.deniedRequest(req.user_id, params.id);
    return res.status(HttpStatus.OK).json(data);
  }
}
