import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationProvider } from './entities/conversation.entity';
import { ConversationMemberProvider } from './entities/conversation.member';
import { ConversationSettingProvider } from './entities/conversation.setting.entity';

@Module({
  imports: [MongooseModule.forFeature([ConversationProvider, ConversationMemberProvider, ConversationSettingProvider])],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
