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
}
