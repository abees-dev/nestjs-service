import { UserResponse } from './user.response';

export class FriendResponse {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserResponse;
  position: number;
  contact_type: number;

  constructor(data: FriendResponse) {
    this._id = data?._id ?? '';
    this.position = data?.createdAt ? new Date(data.createdAt).getTime() : 0;
    this.createdAt = data?.createdAt ?? null;
    this.updatedAt = data?.updatedAt ?? null;
    this.user = data?.user ? new UserResponse(data.user) : null;
    this.contact_type = data?.contact_type ?? 0;
  }

  static mapList(data: FriendResponse[]) {
    return data.map((item) => new FriendResponse(item));
  }
}
