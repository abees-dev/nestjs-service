import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions {
    return {
      uri: process.env.MONGO_URI,
    };
  }

  createMicroserviceOption(): MicroserviceOptions {
    return {
      transport: Transport.TCP,
    };
  }
}
