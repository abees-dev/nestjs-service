import { IsNotEmpty } from 'class-validator';
import { IsObjectId } from '../../decorator/vaidator';

export class AddMemberDto {
  @IsNotEmpty()
  @IsObjectId()
  conversation_id: string;

  @IsNotEmpty()
  @IsObjectId({ each: true })
  members: string[];
}
