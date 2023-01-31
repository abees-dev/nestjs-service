export class FriendResponse {
  _id?: string;
  avatar: string;
  birthday: Date;
  email: string;
  first_name: string;
  full_name: string;
  gender: number;
  last_login: Date;
  last_name: string;
  no_of_followers: number;
  no_of_friends: number;
  phone: string;
  address: string;
  ward_id: number;
  city_id: number;
  country_id: number;
  district_id: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<FriendResponse>) {
    this._id = data?._id ?? '';
    this.avatar = data?.avatar ?? '';
    this.birthday = data?.birthday ?? null;
    this.email = data?.email ?? '';
    this.first_name = data?.first_name ?? '';
    this.full_name = data?.full_name ?? '';
    this.gender = data?.gender ?? 0;
    this.last_login = data?.last_login ?? null;
    this.last_name = data?.last_name ?? '';
    this.no_of_followers = data?.no_of_followers ?? 0;
    this.no_of_friends = data?.no_of_friends ?? 0;
    this.phone = data?.phone ?? '';
    this.address = data?.address ?? '';
    this.ward_id = data?.ward_id ?? 0;
    this.city_id = data?.city_id ?? 0;
    this.country_id = data?.country_id ?? 0;
    this.district_id = data?.district_id ?? 0;
    this.createdAt = data?.createdAt ?? null;
    this.updatedAt = data?.updatedAt ?? null;
  }
}
