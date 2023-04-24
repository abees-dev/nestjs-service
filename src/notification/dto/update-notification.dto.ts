import { IsObjectIdOptional } from '../../decorator/vaidator';
import { IsEnum, IsNumber } from 'class-validator';

export class UpdateNotificationDto {
  @IsObjectIdOptional()
  notification_id: string;

  @IsNumber()
  @IsEnum([0, 1])
  type: number; // 0: update one, 1: update all
}
