import { IsOptional, IsString } from 'class-validator';
import { IsObjectId, IsObjectIdOptional } from '../../decorator/vaidator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiPropertyOptional({
    description: 'content',
    example: 'string',
  })
  @IsOptional()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'comment_reply_id',
    example: '63d8b142aff35fe4d198d4c7',
  })
  @IsOptional()
  @IsObjectIdOptional()
  comment_reply_id: string;

  @ApiPropertyOptional({
    description: 'post_id',
    example: '63d8b142aff35fe4d198d4c7',
  })
  @IsObjectId()
  post_id: string;

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
