import { IsOptional, IsString } from 'class-validator';

export class FeelingQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
