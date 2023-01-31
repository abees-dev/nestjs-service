import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../types/payload';
import { Request } from 'express';
import { Maybe } from '../types';
import { COOKIE_KEY, REFRESH_TOKEN_STRATEGY } from '../contrains';

export class RefreshTokenStrategy extends PassportStrategy(Strategy, REFRESH_TOKEN_STRATEGY) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RefreshTokenStrategy.extractJwt]),
      passReqToCallback: true,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
    });
  }

  private static extractJwt(req: Request): Maybe<string> {
    if (req && req.cookies) {
      return req.cookies[COOKIE_KEY];
    }
    return null;
  }

  async validate(req: Request, payload: IJwtPayload) {
    console.log('payload', payload);
    return payload;
  }
}
