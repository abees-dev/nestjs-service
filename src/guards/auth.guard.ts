import { Injectable, CanActivate, ExecutionContext, Inject, HttpStatus } from '@nestjs/common';
import { AUTH_SERVICE } from '../contrains';
import { AuthService } from '../auth/auth.service';
import { ExceptionResponse } from '../utils/utils.error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, "You don't have permission to access!");
    }
    const payload = await this.authService.verifyToken(token);

    if (!payload?.id) {
      throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, payload?.message ?? 'Invalid token');
    }

    request.user_id = payload.id;
    return true;
  }
}
