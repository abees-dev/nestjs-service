import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { OrderBy } from 'src/types';

export class FeelingQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsNumberString()
  @IsOptional()
  position: number;

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
