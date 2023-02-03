import { IsObjectIdOptional } from '../../decorator/vaidator';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderBy } from 'src/types';

export class QueryCommentDto {
  @IsObjectIdOptional()
  @IsOptional()
  comment_id: string;

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
