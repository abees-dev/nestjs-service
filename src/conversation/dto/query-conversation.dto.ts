import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { OrderBy } from 'src/types';

export class QueryConversationDto {
  @IsNumberString()
  @IsOptional()
  limit: number;

  @IsNumberString()
  @IsOptional()
  position: number;

  @ApiProperty({
    example: -1,
    description: 'Sort by',
    enum: [-1, 1],
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order: OrderBy;
}
