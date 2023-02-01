import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Maybe } from '../types';

export type ClientRedis = Redis;

@Injectable()
export class RedisService {
  private readonly redis: ClientRedis;

  constructor() {
    this.redis = new Redis({
      password: process.env.REDIS_PASSWORD,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      db: 0,
    });
  }

  get store() {
    return this.redis;
  }

  async get<T>(key: string): Promise<Maybe<T>> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
  }
}
