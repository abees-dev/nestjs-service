import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExceptionResponse } from '../utils/utils.error';
import { REFRESH_TOKEN_STRATEGY } from '../contrains';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(REFRESH_TOKEN_STRATEGY) {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, err.message);
    }
    return user;
  }
}
