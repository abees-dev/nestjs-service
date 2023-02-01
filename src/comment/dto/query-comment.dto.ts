import { IsObjectIdOptional } from '../../decorator/vaidator';
import { IsNumberString, IsOptional } from 'class-validator';

export class QueryCommentDto {
  @IsObjectIdOptional()
  @IsOptional()
  comment_id: string;

  @IsNumberString()
  @IsOptional()
  limit: number;

  @IsNumberString()
  @IsOptional()
  position: number;
}
