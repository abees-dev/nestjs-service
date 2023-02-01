import { IsObjectId } from '../../decorator/vaidator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageRemoveDto {
  @ApiProperty({
    description: 'Conversation ID',
    example: '5f9f1b9b9c9d1b1b8c8c8c8c',
  })
  @IsObjectId()
  conversation_id: string;

  @ApiProperty({
    description: 'Message ID',
    example: '5f9f1b9b9c9d1b1b8c8c8c8c',
  })
  @IsObjectId()
  message_id: string;
}
