import { Server } from 'socket.io';

declare global {
  var __socket: Server;
}
