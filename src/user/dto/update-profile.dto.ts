import { IsNumber, IsOptional, IsString, IsPhoneNumber, IsDate, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'Nguyen',
  })
  @IsString()
  @IsOptional()
  first_name: string;

  @ApiPropertyOptional({
    example: 'Van A',
  })
  @IsString()
  @IsOptional()
  last_name: string;

  @ApiPropertyOptional({
    example: '/avatar.png',
  })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiPropertyOptional({
    example: '0332414089',
  })
  @IsString()
  @IsPhoneNumber('VN')
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({
    example: 'string',
  })
  @IsString()
  @IsOptional()
  address: string;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  city_id: number;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  district_id: number;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  ward_id: number;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  country_id: number;

  @ApiPropertyOptional({
    example: 'string',
  })
  @IsNumber()
  @IsOptional()
  thumb_nail: string;

  @ApiPropertyOptional({
    example: '18/11/2000',
  })
  @IsOptional()
  birthday: Date;

  @ApiPropertyOptional({
    example: 'Nguyen Van A',
  })
  @IsString()
  @IsOptional()
  full_name: string;

  @ApiPropertyOptional({
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  gender: number;

  @ApiPropertyOptional({
    example: 12390.123,
  })
  @IsNumber()
  @IsOptional()
  lat: number;

  @ApiPropertyOptional({
    example: 12390.123,
  })
  @IsNumber()
  @IsOptional()
  lng: number;
}

export class UpdateNoOfFriendDto {
  user_id: string;
  target_id: string;
  method: number;
}
