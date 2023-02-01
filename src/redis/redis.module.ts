import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '../config/config.module';
import { REDIS_MODULE, REDIS_SERVICE } from '../contrains';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_MODULE,
      useFactory: (redisService: RedisService) => redisService.store,
      inject: [RedisService],
    },
    {
      provide: REDIS_SERVICE,
      useClass: RedisService,
    },
    RedisService,
  ],
  exports: [REDIS_MODULE, REDIS_SERVICE],
})
export class RedisModule {}
