import { IsNumberString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
}
