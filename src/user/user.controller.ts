import { Body, Controller, Get, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../guards/auth.guard';
import { IRequest } from '../types/context';
import { GetProfileParamsDto } from './dto/params.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from '../response';
import { UserResponseSwagger } from '../response/userDetail.response';

@Controller('user')
@ApiTags('User Controller')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:user_id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseSwagger,
  })
  getProfile(@Req() req: IRequest, @Param() params: GetProfileParamsDto) {
    return this.userService.getProfile(params.user_id);
  }

  @Post('update-profile')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: BaseResponse,
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Req() req: IRequest) {
    return this.userService.updateProfile(req.user_id, updateProfileDto);
  }
}
