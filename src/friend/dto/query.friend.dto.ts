import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class GetSuggestionsQuery {
  @ApiPropertyOptional({
    type: Number,
    description: 'limit',
  })
  @IsNumberString()
  @IsOptional()
  limit: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'position',
  })
  @IsOptional()
  @IsNumberString()
  position: number;
}
