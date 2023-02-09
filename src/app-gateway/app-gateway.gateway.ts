import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { AppGatewayService } from './app-gateway.service';
import { Server, Socket } from 'socket.io';
import { HttpStatus, Logger } from '@nestjs/common';
import { MESSAGE_TYPE, SOCKET_MESSAGE } from '../enum';
import { SocketRoomDto } from './dto/socket-room.dto';
import { MessageDto } from './dto/create-app-gateway.dto';
import { BaseResponse } from '../response';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGatewayGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  private logger = new Logger(AppGatewayGateway.name);

  constructor(private readonly appGatewayService: AppGatewayService) {
    global.__socket = this.server;
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;

      const payload = await this.appGatewayService.handleConnection(token, client.id);

      if (!payload) {
        return client.disconnect();
      }

      client.data.user_id = payload.user_id;

      this.logger.log(`Client connected: ${client.id}`);
    } catch (e) {
      this.handleEventError(client.id, e);
      client.disconnect();
      this.logger.error(e);
    }
  }

  @SubscribeMessage('message-adaptor')
  async handleMessageTestAdaptor(client: Socket, payload: any) {
    client.emit('message', payload);
  }

  async handleDisconnect(client: Socket) {
    try {
      await this.appGatewayService.handleDisconnect(client.id);

      this.logger.log(`Client disconnected: ${client.id}`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any) {
    console.log('message', payload);
  }

  @SubscribeMessage(SOCKET_MESSAGE.JOIN_ROOM)
  async handleJoinRoom(client: Socket, payload: SocketRoomDto) {
    try {
      await this.appGatewayService.handleJoinRoom(client.data.user_id, payload.room_id);

      client.join(payload.room_id);

      this.logger.log(`Client join room: ${client.id} - ${payload.room_id}`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @SubscribeMessage(SOCKET_MESSAGE.LEAVE_ROOM)
  async handleLeaveRoom(client: Socket, payload: SocketRoomDto) {
    try {
      await this.appGatewayService.handleLeaveRoom(client.data.user_id);

      client.leave(payload.room_id);

      this.logger.log(`Client leave room: ${client.id} - ${payload.room_id}`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @SubscribeMessage(SOCKET_MESSAGE.MESSAGE_TEXT)
  async handleMessageText(client: Socket, payload: MessageDto) {
    try {
      const message = await this.appGatewayService.handleMessage(client.data.user_id, payload, MESSAGE_TYPE.TEXT);
      this.server.to(payload.conversation_id).emit(SOCKET_MESSAGE.MESSAGE_TEXT, message);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @SubscribeMessage(SOCKET_MESSAGE.MESSAGE_IMAGE)
  async handleMessageImage(client: Socket, payload: MessageDto) {
    try {
      const message = await this.appGatewayService.handleMessage(client.data.user_id, payload, MESSAGE_TYPE.IMAGE);
      this.server.to(payload.conversation_id).emit(SOCKET_MESSAGE.MESSAGE_IMAGE, message);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @SubscribeMessage(SOCKET_MESSAGE.MESSAGE_VIDEO)
  async handleMessageVideo(client: Socket, payload: MessageDto) {
    try {
      const message = await this.appGatewayService.handleMessage(client.data.user_id, payload, MESSAGE_TYPE.VIDEO);
      this.server.to(payload.conversation_id).emit(SOCKET_MESSAGE.MESSAGE_VIDEO, message);
    } catch (e) {
      this.logger.error(e);
    }
  }



  @SubscribeMessage(SOCKET_MESSAGE.MESSAGE_STICKER)
  async handleMessageSticker(client: Socket, payload: MessageDto) {
    try {
      const message = await this.appGatewayService.handleMessage(client.data.user_id, payload, MESSAGE_TYPE.STICKER);
      this.server.to(payload.conversation_id).emit(SOCKET_MESSAGE.MESSAGE_STICKER, message);
    } catch (e) {
      this.logger.error(e);
    }
  }

  handleEventError(client_id: string, error: any) {
    this.server.to(client_id).emit(
      'error',
      new BaseResponse({
        status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.message || 'Internal server error',
      }),
    );
  }
}
