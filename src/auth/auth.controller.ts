import { Body, Controller, Get, HttpStatus, OnApplicationBootstrap, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { IRequest } from '../types/context';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from '../response';
import { UserLoginResponseSwagger } from '../response/userDetail.response';
import { RefreshTokenResponseSwagger } from '../response/refreshToken.response';

@Controller('auth')
@ApiTags('Auth Controller')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: IRequest) {
    return this.authService.googleLogin(req);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
    type: BaseResponse,
  })
  async registerUser(@Body() user: RegisterDto, @Res() res: Response) {
    const newUser = await this.authService.registerUser(user);
    return res.status(HttpStatus.CREATED).json(newUser);
  }

  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: UserLoginResponseSwagger,
  })
  async loginUser(@Body() user: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(user, res);
    return res.status(HttpStatus.OK).json(data);
  }

  @Get('refresh')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',
    type: RefreshTokenResponseSwagger,
  })
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const data = await this.authService.refreshToken(req.user, res);
    return res.status(HttpStatus.OK).json(data);
  }
}
