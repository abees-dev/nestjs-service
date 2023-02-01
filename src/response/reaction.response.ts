import { Reaction } from '../reaction/entities/reaction.entity';
import { UserResponse } from './user.response';

export class ReactionResponse {
  object_id: string;
  object_type: number;
  type: number;
  user: UserResponse;
  position: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(reaction: ReactionResponse) {
    this.object_id = reaction?.object_id ?? '';
    this.object_type = reaction?.object_type ?? 0;
    this.type = reaction?.type ?? 0;
    this.user = new UserResponse(reaction.user);
    this.position = reaction?.createdAt ? new Date(reaction.createdAt).getTime() : 0;
    this.createdAt = reaction?.createdAt ?? null;
    this.updatedAt = reaction?.updatedAt ?? null;
  }

  static mapList(reactions: ReactionResponse[]): ReactionResponse[] {
    return reactions.map((reaction) => new ReactionResponse(reaction));
  }
}
