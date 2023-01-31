import { IsNumber, IsOptional, IsString } from 'class-validator';

import { IsObjectId } from '../../decorator/vaidator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title',
    example: 'Title',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Caption',
    example: 'Caption',
  })
  @IsOptional()
  @IsString()
  caption: string;

  @ApiProperty({
    description: 'Content',
    example: 'Content',
  })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Location',
    example: 'Location',
  })
  @IsOptional()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Tag',
    example: ['63d8b142aff35fe4d198d4c7'],
  })
  @IsOptional()
  @IsObjectId({ each: true })
  tag: string[];

  @ApiProperty({
    description: 'Meidas',
    example: ['63d809c683d7648134383263'],
  })
  @IsOptional()
  @IsObjectId({ each: true })
  medias: string[];

  @ApiProperty({
    description: 'Status',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  status: number;

  @ApiProperty({
    description: 'View 0: public, 1: friend, 2: private(only me)',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  view: number;
}
