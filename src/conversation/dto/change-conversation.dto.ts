import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsObjectId } from '../../decorator/vaidator';

export class ChangeConversationDto {
  @ApiProperty({
    example: '5f9e1b9b9c9d1c2b8c8b9c9d',
    description: 'conversation_id',
  })
  @IsNotEmpty()
  @IsObjectId()
  conversation_id: string;

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
