import { IsObjectId } from '../../decorator/vaidator';
import { IsOptional, IsString } from 'class-validator';
import { ApiOperation, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({
    example: ['5f9e1b9b9c9d1c2b8c8b9c9d', '5f9e1b9b9c9d1c2b8c8b9c9d'],
    description: 'members',
  })
  @IsObjectId({
    each: true,
  })
  members: string[];

  @ApiPropertyOptional({
    example: 'Group name',
    description: 'name',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'avatar',
    description: 'avatar',
  })
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiPropertyOptional({
    example: 'thumbnail',
    description: 'thumbnail',
  })
  @IsOptional()
  @IsString()
  thumbnail: string;

  @ApiPropertyOptional({
    example: 'description',
    description: 'description',
  })
  @IsOptional()
  @IsString()
  description: string;
}
