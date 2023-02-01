import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CONFIG_SERVICE } from '../contrains';

@Module({
  providers: [
    {
      provide: CONFIG_SERVICE,
      useClass: ConfigService,
    },
    ConfigService,
  ],
  exports: [ConfigService, ConfigModule],
})
export class ConfigModule {}
