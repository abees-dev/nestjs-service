import { Global, Module } from '@nestjs/common';
import { Microservice } from './micro.service';
import { MICRO_SERVICE } from '../contrains';

@Global()
@Module({
  providers: [
    Microservice,
    {
      provide: MICRO_SERVICE,
      useClass: Microservice,
    },
  ],
  exports: [MICRO_SERVICE],
})
export class MicroModule {}
