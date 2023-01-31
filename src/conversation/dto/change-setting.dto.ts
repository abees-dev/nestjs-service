import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IsObjectId } from '../../decorator/vaidator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangeSettingDto {
  @ApiProperty({
    example: '5f9e1b9b9c9d1c2b8c8b9c9d',
    description: 'conversation_id',
  })
  @IsNotEmpty()
  @IsObjectId()
  conversation_id: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'is_blocked',
  })
  @IsOptional()
  @IsNumber()
  is_blocked: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'is_change_avatar',
  })
  @IsOptional()
  @IsNumber()
  is_change_avatar: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'is_change_name',
  })
  @IsOptional()
  @IsNumber()
  is_change_name: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'is_add_member',
  })
  @IsOptional()
  @IsNumber()
  is_invited: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'is_pin_message',
  })
  @IsOptional()
  @IsNumber()
  is_pin_message: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'is_remove_member',
  })
  @IsNumber()
  @IsOptional()
  is_remove_member: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'is_send_message',
  })
  @IsOptional()
  @IsNumber()
  is_send_message: number;
}
