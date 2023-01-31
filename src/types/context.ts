import { Request } from 'express';
import { GoogleProfile } from './google.profile';
import { IJwtPayload } from './payload';

export type IRequest = Request & {
  user: GoogleProfile;
  user_id: string;
};
