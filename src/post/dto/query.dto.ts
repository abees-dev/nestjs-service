import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
}
