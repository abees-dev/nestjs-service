import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { CityResponse, CountryResponse, DistrictResponse, WardResponse } from './data.reponse';
import { BaseResponse } from './index';

export interface IFromLookup extends Partial<Omit<UserDetailResponse, 'country' | 'city' | 'district' | 'ward'>> {
  country: CountryResponse;
  city: CityResponse;
  district: DistrictResponse;
  ward: WardResponse;
}

export class UserDetailResponse {
  @ApiProperty({
    example: '5f9e1b9b9c9d1c2b8c8b9c9d',
    description: '_id',
  })
  _id?: mongoose.Types.ObjectId;

  @ApiProperty({
    example: 'https://www.facebook.com/photo.php?fbid=10218756900000000&set=a.10218756900000000&type=3&theater',
    description: 'avatar',
  })
  avatar: string;

  @ApiProperty({
    example: '2020-11-11T00:00:00.000Z',
    description: 'birthday',
  })
  birthday: Date;

  @ApiProperty({
    example: 'email@gmail.com',
    description: 'email',
  })
  email: string;

  @ApiProperty({
    example: '1000000000000000',
    description: 'facebook_id',
  })
  facebook_id: string;

  @ApiProperty({
    example: 'first_name',
    description: 'first_name',
  })
  first_name: string;

  @ApiProperty({
    example: 'full_name',
    description: 'full_name',
  })
  full_name: string;

  @ApiProperty({
    example: 1,
    description: 'gender',
  })
  gender: number;

  @ApiProperty({
    example: '1000000000000000',
    description: 'github_id',
  })
  github_id: string;

  @ApiProperty({
    example: '1000000000000000',
    description: 'google_id',
  })
  google_id: string;

  @ApiProperty({
    example: '2020-11-11T00:00:00.000Z',
    description: 'last_login',
  })
  last_login: Date;

  @ApiProperty({
    example: 'last_name',
    description: 'last_name',
  })
  last_name: string;

  @ApiProperty({
    example: 10.123456,
    description: 'lat',
  })
  lat: number;

  @ApiProperty({
    example: 10.123456,
    description: 'lng',
  })
  lng: number;

  @ApiProperty({
    example: 1,
    description: 'no_of_followers',
  })
  no_of_followers: number;

  @ApiProperty({
    example: 1,
    description: 'no_of_friends',
  })
  no_of_friends: number;

  @ApiProperty({
    example: '0332123123',
    description: 'phone',
  })
  phone: string;

  @ApiProperty({
    example: 1,
    description: 'role',
  })
  role: number;

  @ApiProperty({
    example: 'search',
    description: 'search',
  })
  search: string;

  @ApiProperty({
    example: 1,
    description: 'status',
  })
  status: number;

  @ApiProperty({
    example: 'thumb_nail',
    description: 'thumb_nail',
  })
  thumb_nail: string;

  @ApiProperty({
    example: 'user_name',
  })
  user_name: string;

  @ApiProperty({
    type: CountryResponse,
  })
  country?: CountryResponse;

  @ApiProperty({
    type: CityResponse,
  })
  city?: CityResponse;

  @ApiProperty({
    type: DistrictResponse,
  })
  district?: DistrictResponse;

  @ApiProperty({
    type: WardResponse,
  })
  ward?: WardResponse;

  @ApiProperty({
    example: 'address',
    description: 'address',
  })
  address: string;

  ward_id: number;
  city_id: number;
  country_id: number;
  district_id: number;

  constructor(user?: Partial<IFromLookup>) {
    this._id = user?._id ?? null;
    this.address = user?.address ?? '';
    this.avatar = user?.avatar ?? '';
    this.birthday = user?.birthday ?? null;
    this.email = user?.email ?? '';
    this.facebook_id = user?.facebook_id ?? '';
    this.first_name = user?.first_name ?? '';
    this.full_name = user?.full_name ?? '';
    this.gender = user?.gender ?? 0;
    this.github_id = user?.github_id ?? '';
    this.google_id = user?.google_id ?? '';
    this.last_login = user?.last_login ?? null;
    this.last_name = user?.last_name ?? '';
    this.lat = user?.lat ?? 0;
    this.lng = user?.lng ?? 0;
    this.no_of_followers = user?.no_of_followers ?? 0;
    this.no_of_friends = user?.no_of_friends ?? 0;
    this.phone = user?.phone ?? '';
    this.role = user?.role ?? 0;
    this.search = user?.search ?? '';
    this.status = user?.status ?? 0;
    this.thumb_nail = user?.thumb_nail ?? '';
    this.user_name = user?.user_name ?? '';
    this.country = CountryResponse.fromLookup(user?.country);
    this.city = CityResponse.fromLookup(user?.city);
    this.district = DistrictResponse.fromLookup(user?.district);
    this.ward = WardResponse.fromLookup(user?.ward);
  }

  static fromLookup(entity: IFromLookup) {
    return new UserDetailResponse({
      ...entity,
      country: entity.country[0],
      city: entity.city[0],
      district: entity.district[0],
      ward: entity.ward[0],
    });
  }
}

export class UserResponseSwagger extends BaseResponse {
  @ApiProperty({
    type: UserDetailResponse,
  })
  data: UserDetailResponse;
}

export class UserLoginResponse {
  @ApiProperty({
    example: 'token',
    description: 'token',
  })
  access_token: string;

  @ApiProperty({
    type: UserDetailResponse,
  })
  user: UserDetailResponse;
}

export class UserLoginResponseSwagger extends BaseResponse {
  @ApiProperty({
    type: UserLoginResponse,
  })
  data: UserLoginResponse;
}
