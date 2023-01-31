import { Country, CountryDocument } from '../data/entities/country.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CountryResponse {
  _id: string;
  country_id: number;
  country_name: string;
  country_slug: string;

  constructor(country?: Partial<CountryResponse>) {
    this._id = country?._id ?? '';
    this.country_id = country?.country_id ?? 0;
    this.country_name = country?.country_name ?? '';
  }

  static fromLookup(country: Country): CountryResponse {
    return new CountryResponse(country);
  }
}

export class CityResponse {
  @ApiProperty({
    example: '5f9e1b9b9c9d1c2b8c8b9c9d',
    description: '_id',
  })
  _id: string;

  @ApiProperty({
    example: 1,
    description: 'city_id',
  })
  city_id: number;

  @ApiProperty({
    example: 'Hà Nội',
    description: 'city_name',
  })
  city_name: string;
  city_slug: string;

  constructor(city?: CityResponse) {
    this._id = city?._id ?? '';
    this.city_id = city?.city_id ?? 0;
    this.city_name = city?.city_name ?? '';
  }

  static fromLookup(city: CityResponse): CityResponse {
    return new CityResponse(city);
  }
}

export class DistrictResponse {
  @ApiProperty({
    example: '5f9e1b9b9c9d1c2b8c8b9c9d',
    description: '_id',
  })
  _id: string;

  @ApiProperty({
    example: 1,
    description: 'district_id',
  })
  district_id: number;

  @ApiProperty({
    example: 'Hà Nội',
    description: 'district_name',
  })
  district_name: string;
  district_slug: string;

  constructor(district?: DistrictResponse) {
    this._id = district?._id ?? '';
    this.district_id = district?.district_id ?? 0;
    this.district_name = district?.district_name ?? '';
  }

  static fromLookup(district: DistrictResponse): DistrictResponse {
    return new DistrictResponse(district);
  }
}

export class WardResponse {
  @ApiProperty({
    example: '5f9e1b9b9c9d1c2b8c8b9c9d',
    description: '_id',
  })
  _id: string;

  @ApiProperty({
    example: 1,
    description: 'ward_id',
  })
  ward_id: number;

  @ApiProperty({
    example: 'Hà Nội',
    description: 'ward_name',
  })
  ward_name: string;
  ward_slug: string;

  constructor(ward?: WardResponse) {
    this._id = ward?._id ?? '';
    this.ward_id = ward?.ward_id ?? 0;
    this.ward_name = ward?.ward_name ?? '';
  }

  static fromLookup(ward: WardResponse): WardResponse {
    return new WardResponse(ward);
  }
}
