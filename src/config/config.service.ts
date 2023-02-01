import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { RedisOptions } from 'ioredis';

@Injectable()
export class ConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions {
    return {
      uri: process.env.MONGO_URI,
    };
  }
}
