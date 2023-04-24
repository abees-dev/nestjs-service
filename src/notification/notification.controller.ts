import { Body, Controller, Get, Inject, Post, Query, Req, UseGuards } from '@nestjs/common';

import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteDeviceDto, RegisterDeviceDto } from './dto/register-device.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PayloadNotificationDto } from './dto/payload-notification.dto';
import { MICRO_SERVICE } from '../contrains';
import { Microservice } from '../microservice/micro.service';
import { MESSAGE_PATTERN, NOTIFICATION_TYPE } from '../enum';
import { AuthGuard } from '../guards/auth.guard';
import { IRequest } from '../types/context';
import { QueryNotificationDto } from './dto/query.notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notification')
@ApiTags('Notification Controller')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject(MICRO_SERVICE) private microservice: Microservice,
  ) {}

  @MessagePattern(MESSAGE_PATTERN.NOTIFY_PRIORITY_HANDLER)
  async notifyHandler(@Payload() payload: PayloadNotificationDto) {
    switch (payload.notification_type) {
      case NOTIFICATION_TYPE.ACCEPT_FRIEND:
        return await this.notificationService.notifyHandlerSingle(payload);
      case NOTIFICATION_TYPE.SEND_FRIEND:
        return await this.notificationService.notifyHandlerSingle(payload);
      case NOTIFICATION_TYPE.COMMENT_POST:
        return await this.notificationService.notifyHandlerCommentPost(payload);
      case NOTIFICATION_TYPE.REACTION_POST:
        return await this.notificationService.notifyHandlerCommentPost(payload);
      case NOTIFICATION_TYPE.NEW_MESSAGE:
        return await this.notificationService.notifyMessage(payload);
      default:
        return;
    }
  }

  @Post('register-device')
  async registerDevice(@Body() registerDeviceDto: RegisterDeviceDto) {
    return await this.notificationService.registerDevice(registerDeviceDto);
  }

  @Post('delete-device')
  async deleteDevice(@Body() deleteDeviceDto: DeleteDeviceDto) {
    return await this.notificationService.deleteDevice(deleteDeviceDto);
  }

  @Post('read-notification')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async readNotification(@Req() req: IRequest, @Body() updateNotificationDto: UpdateNotificationDto) {
    return await this.notificationService.readNotification(req.user_id, updateNotificationDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getNotification(@Req() req: IRequest, @Query() query: QueryNotificationDto) {
    return await this.notificationService.getNotification(req.user_id, query);
  }
}
