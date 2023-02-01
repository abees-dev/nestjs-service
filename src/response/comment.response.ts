import { Comment } from '../comment/entities/comment.entity';
import { UserResponse } from './user.response';
import { MediaResponse } from './media.response';

export class CommentResponse {
  _id: string;
  comment_reply_id: string;
  content: string;
  deleted: number;
  no_of_angry: number;
  no_of_dear: number;
  no_of_haha: number;
  no_of_like: number;
  no_of_love: number;
  no_of_reaction: number;
  no_of_reply: number;
  no_of_sad: number;
  no_of_wow: number;
  post_id: string;
  status: number;
  thumbnail: string;
  media: MediaResponse;
  tag: UserResponse[];
  user: UserResponse;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  my_reaction: number;

  constructor(comment: CommentResponse) {
    this._id = comment?._id ?? '';
    this.comment_reply_id = comment?.comment_reply_id ?? '';
    this.content = comment?.content ?? '';
    this.deleted = comment?.deleted ?? 0;
    this.no_of_angry = comment?.no_of_angry ?? 0;
    this.no_of_dear = comment?.no_of_dear ?? 0;
    this.no_of_haha = comment?.no_of_haha ?? 0;
    this.no_of_like = comment?.no_of_like ?? 0;
    this.no_of_love = comment?.no_of_love ?? 0;
    this.no_of_reaction = comment?.no_of_reaction ?? 0;
    this.no_of_reply = comment?.no_of_reply ?? 0;
    this.no_of_sad = comment?.no_of_sad ?? 0;
    this.no_of_wow = comment?.no_of_wow ?? 0;
    this.post_id = comment?.post_id ?? '';
    this.status = comment?.status ?? 0;
    this.thumbnail = comment?.thumbnail ?? '';
    this.media = comment?.media ? new MediaResponse(comment?.media) : null;
    this.tag = UserResponse.mapList(comment?.tag);
    this.user = new UserResponse(comment?.user);
    this.position = comment?.createdAt ? new Date(comment.createdAt).getTime() : 0;
    this.createdAt = comment?.createdAt ?? null;
    this.updatedAt = comment?.updatedAt ?? null;
    this.my_reaction = comment?.my_reaction ?? 0;
  }

  static mapList(comments: CommentResponse[]): CommentResponse[] {
    return comments.map((comment) => new CommentResponse(comment));
  }
}
