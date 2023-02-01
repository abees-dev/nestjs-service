import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { MessageRemoveDto } from './dto/message-remove.dto';
import { IRequest } from '../types/context';
import { GetMessagesDto } from './dto/param.message.dto';
import { QueryMessageDto } from './dto/query.message.dto';

@Controller('message')
@ApiTags('Message Controller')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':conversation_id')
  @ApiBearerAuth()
  async getMessages(@Req() req: IRequest, @Param() params: GetMessagesDto, @Query() queryMessageDto: QueryMessageDto) {
    return await this.messageService.getMessages(req.user_id, params.conversation_id, queryMessageDto);
  }

  @Post('remove')
  @ApiBearerAuth()
  async removeMessage(@Body() messageRemoveDto: MessageRemoveDto, @Req() req: IRequest) {
    return await this.messageService.removeMessage(req.user_id, messageRemoveDto);
  }
}
