import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsObjectId, IsObjectIdOptional } from '../../decorator/vaidator';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'comment_id',
    example: '63d8b142aff35fe4d198d4c7',
  })
  @IsObjectId()
  comment_id: string;

  @ApiPropertyOptional({
    description: 'content',
    example: 'string',
  })
  @IsOptional()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'thumbnail',
    example: 'string',
  })
  @IsOptional()
  @IsString()
  thumbnail: string;

  @ApiPropertyOptional({
    description: 'media',
    example: '63d8b142aff35fe4d198d4c7',
  })
  @IsOptional()
  @IsObjectIdOptional()
  media: string;

  @ApiPropertyOptional({
    description: 'tag',
    example: ['63d8b142aff35fe4d198d4c7'],
  })
  @IsOptional()
  @IsObjectId({ each: true })
  tag: string[];
}
