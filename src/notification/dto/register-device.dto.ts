import { IsObjectId } from '../../decorator/vaidator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDeviceDto {
  @IsObjectId()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  push_token: string;

  @IsNotEmpty()
  @IsString()
  device_id: string;

  @IsOptional()
  @IsString()
  platform: string;
}
