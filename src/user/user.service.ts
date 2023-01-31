import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BaseResponse } from '../response';
import { IFromLookup, UserDetailResponse } from '../response/userDetail.response';
import { CatchError, ExceptionResponse } from '../utils/utils.error';
import { Format } from '../utils/utils.format';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserDocument, USER_SCHEMA } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER_SCHEMA) private userDocument: Model<UserDocument>) {}

  async getProfile(user_id: string) {
    try {
      const response: IFromLookup[] = await this.userDocument.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(user_id), status: 1 },
        },
        {
          $lookup: { from: 'cities', localField: 'city_id', foreignField: 'city_id', as: 'city' },
        },
        {
          $lookup: { from: 'countries', localField: 'country_id', foreignField: 'country_id', as: 'country' },
        },
        {
          $lookup: { from: 'districts', localField: 'district_id', foreignField: 'district_id', as: 'district' },
        },
        {
          $lookup: { from: 'wards', localField: 'ward_id', foreignField: 'ward_id', as: 'ward' },
        },
        {
          $addFields: {
            city: { $arrayElemAt: ['$city', 0] },
            country: { $arrayElemAt: ['$country', 0] },
            district: { $arrayElemAt: ['$district', 0] },
            ward: { $arrayElemAt: ['$ward', 0] },
          },
        },
      ]);

      if (!response.length) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'User not found');
      }

      return new BaseResponse({
        data: new UserDetailResponse(response[0]),
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async updateProfile(user_id: string, updateProfileDto: UpdateProfileDto) {
    try {
      const user = await this.userDocument.findById(user_id);
      if (!user) {
        throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'User not found');
      }
      user.set({
        ...updateProfileDto,
        ...(updateProfileDto?.birthday && { birthday: Format.toDate(updateProfileDto.birthday) }),
      });
      await user.save();
      return new BaseResponse({
        message: 'Update profile successfully',
        status: HttpStatus.OK,
      });
    } catch (error) {
      throw new CatchError(error);
    }
  }
}
