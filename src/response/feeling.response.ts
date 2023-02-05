export class FeelingResponse {
  facebook_id: string;
  icon: string;
  name: string;
  search: string;
  _id: string;

  constructor(feeling: FeelingResponse) {
    this._id = feeling?._id ?? '';
    this.facebook_id = feeling?.facebook_id ?? '';
    this.icon = feeling?.icon ?? '';
    this.name = feeling?.name ?? '';
    this.search = feeling?.search ?? '';
  }

  static mapList(feelings: FeelingResponse[]): FeelingResponse[] {
    return feelings.map((feeling) => new FeelingResponse(feeling));
  }
}
