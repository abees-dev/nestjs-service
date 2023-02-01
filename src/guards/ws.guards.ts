import { Injectable, CanActivate, ExecutionContext, Inject, HttpStatus } from '@nestjs/common';
import { AUTH_SERVICE } from '../contrains';
import { AuthService } from '../auth/auth.service';
import { ExceptionResponse } from '../utils/utils.error';

@Injectable()
export class WsGuards implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToWs().getClient();
    const token = request.handshake.headers.authorization;
    if (!token) {
      return false;
    }
    const payload = await this.authService.verifyToken(token);

    if (!payload?.id) {
      return false;
    }

    request.user_id = payload.id;
    return true;
  }
}
