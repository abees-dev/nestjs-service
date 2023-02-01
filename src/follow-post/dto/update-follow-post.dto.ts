import { PartialType } from '@nestjs/mapped-types';
import { CreateFollowPostDto } from './create-follow-post.dto';

export class UpdateFollowPostDto extends PartialType(CreateFollowPostDto) {
  id: number;
}
