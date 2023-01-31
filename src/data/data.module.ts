import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CityProvider } from './entities/city.entity';
import { DistrictProvider } from './entities/district.entity';
import { CountryProvider } from './entities/country.entity';
import { WardProvider } from './entities/ward.entity';

@Module({
  imports: [MongooseModule.forFeature([CityProvider, DistrictProvider, WardProvider, CountryProvider])],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
