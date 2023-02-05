export class FeelingResponse {
  facebook_id: string;
  icon: string;
  name: string;
  search: string;
  _id: string;
  position: number;
  createdAt: string;

  constructor(feeling: FeelingResponse) {
    this._id = feeling?._id ?? '';
    this.facebook_id = feeling?.facebook_id ?? '';
    this.icon = feeling?.icon ?? '';
    this.name = feeling?.name ?? '';
    this.search = feeling?.search ?? '';
    this.position = feeling?.createdAt ? new Date(feeling.createdAt).getTime() : 0;
    this.createdAt = feeling?.createdAt ?? null;
  }

  static mapList(feelings: FeelingResponse[]): FeelingResponse[] {
    return feelings.map((feeling) => new FeelingResponse(feeling));
  }
}
