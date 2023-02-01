import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class QueryReactionDto {
  @ApiPropertyOptional({
    description: 'Type of reaction, 0: like, 1: love, 2: haha, 3: wow, 4: sad, 5: angry, 6: dear',
    example: 0,
  })
  @IsNumberString()
  @IsOptional()
  type: number;

  @ApiPropertyOptional({
    description: 'Limit number of reaction',
    example: 10,
  })
  @IsNumberString()
  @IsOptional()
  limit: number;

  @ApiPropertyOptional({
    description: 'Position of reaction',
    example: 0,
  })
  @IsNumberString()
  @IsOptional()
  position: number;
}
