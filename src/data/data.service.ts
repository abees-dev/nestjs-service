import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { COUNTRY_SCHEMA, CountryDocument } from './entities/country.entity';
import { Model } from 'mongoose';
import { CITY_SCHEMA, CityDocument } from './entities/city.entity';
import { DISTRICT_SCHEMA, DistrictDocument } from './entities/district.entity';
import { WARD_SCHEMA, WardDocument } from './entities/ward.entity';

@Injectable()
export class DataService {
  constructor(
    @InjectModel(COUNTRY_SCHEMA) private countryModel: Model<CountryDocument>,
    @InjectModel(CITY_SCHEMA) private cityDocumentModel: Model<CityDocument>,
    @InjectModel(DISTRICT_SCHEMA) private districtDocumentModel: Model<DistrictDocument>,
    @InjectModel(WARD_SCHEMA) private wardDocumentModel: Model<WardDocument>,
  ) {}

  // async onApplicationBootstrap() {
  //   console.log('onApplicationBootstrap');
  //   console.log('cityData');
  //   for (const cityEntity of cityData) {
  //     const city = new this.cityDocumentModel({
  //       city_id: cityEntity.id,
  //       city_name: cityEntity.name,
  //       city_slug: Format.normalizedString(cityEntity.name),
  //       country_id: cityEntity.country_id,
  //     });
  //     await city.save();
  //   }
  //
  //   console.log('districtData');
  //   for (const districtEntity of districtData) {
  //     const district = new this.districtDocumentModel({
  //       district_id: districtEntity.id,
  //       district_name: districtEntity.name,
  //       district_slug: Format.normalizedString(districtEntity.name),
  //       city_id: districtEntity.city_id,
  //     });
  //     await district.save();
  //   }
  //
  //   console.log('wardData');
  //   for (const wardEntity of wardData) {
  //     const ward = new this.wardDocumentModel({
  //       ward_id: wardEntity.id,
  //       ward_name: wardEntity.name,
  //       ward_slug: Format.normalizedString(wardEntity.name),
  //       district_id: wardEntity.district_id,
  //     });
  //     await ward.save();
  //   }
  // }
}
