import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Injectable()
export class Microservice implements OnApplicationBootstrap {
  @Client({ transport: Transport.TCP })
  client: ClientProxy;

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  send<T>(pattern: string, data: T) {
    this.client.emit(pattern, data);
  }
}
