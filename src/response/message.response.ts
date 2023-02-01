import { MediaResponse } from './media.response';
import { UserResponse } from './user.response';

export class MessageResponse {
  _id: string;
  conversation_id: string;
  link: string;
  message: string;
  message_reply: string;
  thumbnail: string;
  type: number;
  createdAt: Date;
  updatedAt: Date;
  position: number;
  tag: UserResponse[];
  medias: MediaResponse[];
  target_user: UserResponse[];
  user: UserResponse;

  constructor(data: MessageResponse) {
    this._id = data?._id ?? '';
    this.conversation_id = data?.conversation_id ?? '';
    this.link = data?.link ?? '';
    this.message = data?.message ?? '';
    this.message_reply = data?.message_reply ?? '';
    this.thumbnail = data?.thumbnail ?? '';
    this.type = data?.type ?? 0;
    this.createdAt = data?.createdAt ?? null;
    this.updatedAt = data?.updatedAt ?? null;
    this.position = data?.createdAt ? new Date(data.createdAt).getTime() : 0;
    this.tag = UserResponse.mapList(data?.tag);
    this.medias = MediaResponse.mapList(data?.medias);
    this.target_user = UserResponse.mapList(data?.target_user);
    this.user = new UserResponse(data?.user);
  }

  static mapList(data: MessageResponse[]) {
    return data.map((item) => new MessageResponse(item));
  }
}
