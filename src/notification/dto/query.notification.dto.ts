import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderBy } from '../../types';
import { IsNumberString, IsOptional } from 'class-validator';

export class QueryNotificationDto {
  @ApiPropertyOptional({
    description: 'Limit',
  })
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Position',
  })
  @IsOptional()
  @IsNumberString()
  position?: number;

  @ApiPropertyOptional({
    description: 'User ID',
  })
  @IsOptional()
  order: OrderBy;
}
