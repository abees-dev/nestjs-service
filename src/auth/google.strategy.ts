import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { GoogleProfile } from '../types/google.profile';
import { STRATEGY } from '../enum/strategy';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile', 'openid'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    const { name, emails, photos, id } = profile;

    const first_name = name?.givenName ?? '';
    const last_name = name?.familyName ?? '';

    const user: GoogleProfile = {
      strategy_id: id,
      first_name,
      last_name,
      full_name: `${first_name} ${last_name}`.replace(/\s+$/, ''),
      avatar: photos[0].value,
      email: emails[0].value,
      strategy: STRATEGY.GOOGLE,
    };
    done(null, user);
  }
}
