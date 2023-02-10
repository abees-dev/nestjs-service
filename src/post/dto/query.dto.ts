import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObjectIdOptional } from '../../decorator/vaidator';

export class GetPostQuery {
  @ApiPropertyOptional({
    description: 'Limit',
    example: 10,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Position',
    example: 0,
  })
  @IsOptional()
  @IsNumberString()
  position?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsObjectIdOptional()
  user_id?: string;
}
