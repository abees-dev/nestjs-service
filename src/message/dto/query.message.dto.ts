import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderBy } from 'src/types';

export class QueryMessageDto {
  @ApiPropertyOptional({
    description: 'Position',
    example: 0,
  })
  @IsNumberString()
  @IsOptional()
  position: number;

  @ApiPropertyOptional({
    description: 'Limit',
    example: 10,
  })
  @IsNumberString()
  @IsOptional()
  limit: number;

  @ApiProperty({
    example: -1,
    description: 'Sort by',
    enum: [-1, 1],
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order: OrderBy;
}
