import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class UserResponse {
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
    example: 'last_name',
    description: 'last_name',
  })
  last_name: string;

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
    example: 1,
    description: 'role',
  })
  role: number;

  constructor(user: Partial<UserResponse>) {
    this._id = user?._id ?? null;
    this.email = user?.email ?? '';
    this.first_name = user?.first_name ?? '';
    this.last_name = user?.last_name ?? '';
    this.full_name = user?.full_name ?? '';
    this.gender = user?.gender ?? 0;
    this.role = user?.role ?? 0;
    this.avatar = user?.avatar ?? '';
    this.birthday = user?.birthday ?? null;
    this.no_of_followers = user?.no_of_followers ?? 0;
    this.no_of_friends = user?.no_of_friends ?? 0;
  }

  static mapList(user: Partial<UserResponse[]>) {
    return user.map((item) => new UserResponse(item));
  }
}
