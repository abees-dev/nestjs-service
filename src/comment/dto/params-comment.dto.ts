import { IsObjectId } from '../../decorator/vaidator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCommentDto {
  @ApiProperty({
    description: 'Post ID',
    example: '63d8b142aff35fe4d198d4c7',
  })
  @IsObjectId()
  post_id: string;
}

export class RemoveCommentDto {
  @ApiProperty({
    description: 'Comment ID',
    example: '63d8b142aff35fe4d198d4c7',
  })
  @IsObjectId()
  comment_id: string;
}
