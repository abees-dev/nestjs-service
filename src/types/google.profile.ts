import { IJwtPayload } from './payload';

export interface GoogleProfile extends Partial<IJwtPayload> {
  strategy_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  avatar: string;
  strategy: number;
}
