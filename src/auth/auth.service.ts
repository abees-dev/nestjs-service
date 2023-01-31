import { HttpException, HttpStatus, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AUTH_SCHEMA, AuthDocument } from './entities/auth.entity';
import mongoose, { Model } from 'mongoose';
import { User, USER_SCHEMA, UserDocument } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { CatchError, ExceptionResponse } from '../utils/utils.error';
import { Format } from '../utils/utils.format';
import { BaseResponse } from '../response';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserDetailResponse } from '../response/userDetail.response';
import { Request, Response } from 'express';
import { IRequest } from '../types/context';
import * as process from 'process';
import { STRATEGY } from '../enum/strategy';
import { UserService } from '../user/user.service';
import { IJwtPayload } from '../types/payload';
import { ACCESS_TOKEN_EXPIRES_IN, COOKIE_KEY, REFRESH_TOKEN_EXPIRES_IN } from '../contrains';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AUTH_SCHEMA) private authDocument: Model<AuthDocument>,
    @InjectModel(USER_SCHEMA) private userDocument: Model<UserDocument>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async getUserByEmail(email: string): Promise<UserDocument> {
    return this.userDocument.findOne({
      email: email,
    });
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async generateToken(user: UserDocument) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(
        { id: user._id, lat: user.lat, lng: user.lng },
        {
          expiresIn: ACCESS_TOKEN_EXPIRES_IN,
          secret: process.env.ACCESS_TOKEN_SECRET,
        },
      ),
      this.jwtService.sign(
        { id: user._id, lat: user.lat, lng: user.lng },
        {
          expiresIn: REFRESH_TOKEN_EXPIRES_IN,
          secret: process.env.REFRESH_TOKEN_SECRET,
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async handleAuthLogin(user_id: mongoose.Types.ObjectId, access_token: string, refresh_token: string) {
    const exitAuth = await this.authDocument.findOne({ user_id });

    if (exitAuth) {
      exitAuth.refresh_token = refresh_token;
      exitAuth.access_token = access_token;
      await exitAuth.save();
    } else {
      const newAuth = new this.authDocument({
        user_id,
        refresh_token,
        access_token,
      });
      await newAuth.save();
    }
  }

  setCooKie(res: Response, token: string) {
    res.cookie(COOKIE_KEY, token, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: 'strict',
    });
  }

  async verifyToken(token: string) {
    try {
      const exitAuth = await this.authDocument.findOne({ access_token: token });

      if (!exitAuth) throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'Token is invalid');

      return await this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (error) {
      return new CatchError(error);
    }
  }

  async googleLogin(req: IRequest) {
    try {
      const { user } = req;
      const existUser = await this.getUserByEmail(user.email);
      if (existUser && existUser?.strategy === STRATEGY.GOOGLE) {
        const { accessToken, refreshToken } = await this.generateToken(existUser);

        await this.handleAuthLogin(existUser._id, accessToken, refreshToken);

        this.setCooKie(req.res, refreshToken);
        return new BaseResponse({ data: { access_token: accessToken, user: new UserDetailResponse(existUser) } });
      }

      if (existUser && existUser?.strategy !== STRATEGY.GOOGLE)
        throw new ExceptionResponse(
          HttpStatus.FORBIDDEN,
          "User already exists, but Google account was not connected to user's account",
        );

      const newUser = new this.userDocument({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.full_name,
        search: Format.searchString(user.full_name),
        user_name: user.email.split('@')[0],
        avatar: user.avatar,
        password: process.env.PASSWORD_DEFAULT,
        strategy: user.strategy,
        google_id: user.strategy_id,
      });

      await newUser.save();
      const { accessToken, refreshToken } = await this.generateToken(newUser);
      await this.handleAuthLogin(existUser._id, accessToken, refreshToken);

      this.setCooKie(req.res, refreshToken);
      return new BaseResponse({ data: { access_token: accessToken, user: new UserDetailResponse(newUser) } });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async registerUser(user: RegisterDto) {
    try {
      const { email, gender, first_name, last_name, password } = user;
      const existUser = await this.getUserByEmail(email);
      if (existUser) throw new ExceptionResponse(HttpStatus.CONFLICT, 'Email already exists');
      const fullName = `${first_name} ${last_name}`;
      const newUser = new this.userDocument({
        email,
        gender,
        first_name,
        last_name,
        full_name: fullName,
        search: Format.searchString(fullName),
        user_name: email.split('@')[0],
        password: await this.hashPassword(password),
      });
      await newUser.save();
      return new BaseResponse({ message: 'Register success' });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async login(loginDto: LoginDto, res: Response) {
    try {
      const exitUser = await this.getUserByEmail(loginDto.email);
      if (!exitUser) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Email or Password is incorrect');

      const isMatch = await this.comparePassword(loginDto.password, exitUser.password);
      if (!isMatch) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Email or Password is incorrect');

      const { accessToken, refreshToken } = await this.generateToken(exitUser);

      await this.handleAuthLogin(exitUser._id, accessToken, refreshToken);

      const userResponse = await this.userService.getProfile(exitUser._id.toString());

      this.setCooKie(res, refreshToken);
      return new BaseResponse({ data: { access_token: accessToken, user: userResponse } });
    } catch (e) {
      throw new CatchError(e);
    }
  }

  async refreshToken(payload: Express.User, res: Response) {
    try {
      const { id } = payload as IJwtPayload;
      const exitAuth = await this.authDocument.findOne({ user_id: id });
      if (!exitAuth) throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'Invalid');
      const existUser = await this.userDocument.findById(id);

      if (!existUser) throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'Invalid Token');

      const { accessToken, refreshToken } = await this.generateToken(existUser);

      await this.handleAuthLogin(existUser._id, accessToken, refreshToken);

      this.setCooKie(res, refreshToken);

      return new BaseResponse({ data: { access_token: accessToken } });
    } catch (error) {
      throw new CatchError(error);
    }
  }
}
