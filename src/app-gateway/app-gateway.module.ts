import { Module } from '@nestjs/common';
import { AppGatewayService } from './app-gateway.service';
import { AppGatewayGateway } from './app-gateway.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageProvider } from '../message/entities/message.entity';
import { ConversationProvider } from '../conversation/entities/conversation.entity';
import { ConversationMemberProvider } from '../conversation/entities/conversation.member';
import { MessageRemoveProvider } from '../message/entities/message-remove.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      MessageProvider,
      ConversationProvider,
      ConversationMemberProvider,
      MessageRemoveProvider,
    ]),
  ],
  providers: [AppGatewayGateway, AppGatewayService],
})
export class AppGatewayModule {}
