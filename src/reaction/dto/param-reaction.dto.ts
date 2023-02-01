import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from '../../decorator/vaidator';

export class ParamReactionDto {
  @ApiProperty({
    description: 'Object_id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsObjectId()
  object_id: string;
}

export class ReactionPostPramDto {
  @ApiProperty({
    description: 'Post_id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsObjectId()
  post_id: string;
}
