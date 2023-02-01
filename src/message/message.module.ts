import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageProvider } from './entities/message.entity';
import { MessageRemoveProvider } from './entities/message-remove.entity';
import { ConversationProvider } from '../conversation/entities/conversation.entity';

@Module({
  imports: [MongooseModule.forFeature([MessageProvider, MessageRemoveProvider, ConversationProvider])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
