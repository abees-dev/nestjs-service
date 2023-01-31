import { IsNotEmpty } from 'class-validator';
import { IsObjectId } from '../../decorator/vaidator';
import { ApiProperty } from '@nestjs/swagger';

export class ParamsConversationDto {
  @ApiProperty({
    example: '5f9e1b9b9c9d1c2b8c8b9c9d',
    description: 'conversation_id',
  })
  @IsNotEmpty()
  @IsObjectId()
  conversation_id: string;
}

export class LeaveConversationDto {
  @ApiProperty({
    example: '5f9e1b9b9c9d1c2b8c8b9c9d',
    description: 'conversation_id',
  })
  @IsNotEmpty()
  @IsObjectId()
  conversation_id: string;

  @ApiProperty({
    example: '5f9e1b9b9c9d1c2b8c8b9c9d',
    description: 'user_id',
  })
  @ApiProperty({})
  @IsNotEmpty()
  user_id: string;
}
