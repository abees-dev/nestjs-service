import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { IRequest } from '../types/context';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ChangeSettingDto } from './dto/change-setting.dto';
import { LeaveConversationDto, ParamsConversationDto } from './dto/params.conversation.dto';
import { AddMemberDto } from './entities/addmember.dto';
import { ChangeConversationDto } from './dto/change-conversation.dto';
import { ChangeAdminDto } from './dto/change-admin.dto';

@Controller('conversation')
@ApiTags('Conversation Controller')
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  @ApiBearerAuth()
  async getConversations(@Req() req: IRequest) {
    return await this.conversationService.getConversations(req.user_id);
  }

  //Get Detail
  @Get(':conversation_id')
  @ApiBearerAuth()
  async getDetailConversation(@Req() req: IRequest, @Param() param: ParamsConversationDto) {
    return await this.conversationService.getDetailConversation(req.user_id, param.conversation_id);
  }

  @Get('get-setting/:conversation_id')
  @ApiBearerAuth()
  async getSetting(@Req() req: IRequest, @Param() param: ParamsConversationDto) {
    return await this.conversationService.getSetting(req.user_id, param.conversation_id);
  }

  @Post('create')
  @ApiBearerAuth()
  async createConversation(@Req() req: IRequest, @Body() createConversationDto: CreateConversationDto) {
    return await this.conversationService.createConversation(req.user_id, createConversationDto);
  }

  @Post('change-setting')
  @ApiBearerAuth()
  async changeSetting(@Req() req: IRequest, @Body() changeSettingDto: ChangeSettingDto) {
    return await this.conversationService.changeSetting(req.user_id, changeSettingDto);
  }

  @Post('add-member')
  @ApiBearerAuth()
  async addMember(@Req() req: IRequest, @Body() addMemberDto: AddMemberDto) {
    return await this.conversationService.addMember(req.user_id, addMemberDto);
  }

  @Post('remove-member')
  @ApiBearerAuth()
  async removeMember(@Req() req: IRequest, @Body() addMemberDto: AddMemberDto) {
    return await this.conversationService.removeMember(req.user_id, addMemberDto);
  }

  @Post('leave-conversation/:conversation_id')
  @ApiBearerAuth()
  async leaveConversation(@Req() req: IRequest, @Param() param: ParamsConversationDto) {
    return await this.conversationService.leaveConversation(req.user_id, param.conversation_id);
  }

  @Post('delete-conversation/:conversation_id')
  @ApiBearerAuth()
  async deleteConversation(@Req() req: IRequest, @Param() param: ParamsConversationDto) {
    return await this.conversationService.deleteConversation(req.user_id, param.conversation_id);
  }

  @Post('change-profile')
  @ApiBearerAuth()
  async changeConversationProfile(@Req() req: IRequest, @Body() changeConversationDto: ChangeConversationDto) {
    return await this.conversationService.changeConversationProfile(req.user_id, changeConversationDto);
  }

  @Post('change-admin')
  @ApiBearerAuth()
  async changeAdmin(@Req() req: IRequest, @Body() changeAdminDto: ChangeAdminDto) {
    return await this.conversationService.changeAdmin(req.user_id, changeAdminDto);
  }
}
