import { IsObjectId } from '../../decorator/vaidator';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReactionDto {
  @ApiProperty({
    description: 'Object id',
    example: '5f9f1c9c1c9d440000a1b1b1',
  })
  @IsObjectId()
  object_id: string;

  @ApiProperty({
    description: '0: like, 1: love, 2: haha, 3: wow, 4: sad, 5: angry, 6: dear',
    example: 1,
    //
  })
  @IsNumber()
  type: number;
}

export class CreateReactionPostDto {
  @ApiProperty({
    description: 'Object id',
    example: '5f9f1c9c1c9d440000a1b1b1',
  })
  @IsObjectId()
  post_id: string;

  @ApiProperty({
    description: '0: like, 1: love, 2: haha, 3: wow, 4: sad, 5: angry, 6: dear',
    example: 1,
    //
  })
  @IsNumber()
  type: number;
}

export class CreateReactionCommentDto {
  @ApiProperty({
    description: 'Object id',
    example: '5f9f1c9c1c9d440000a1b1b1',
  })
  @IsObjectId()
  comment_id: string;

  @ApiProperty({
    description: '0: like, 1: love, 2: haha, 3: wow, 4: sad, 5: angry, 6: dear',
    example: 1,
    //
  })
  @IsNumber()
  type: number;
}
