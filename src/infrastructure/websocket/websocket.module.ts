import { Module } from '@nestjs/common';
import { AttendanceGateway } from './websocket.gateway';

@Module({
  providers: [AttendanceGateway],
  exports: [AttendanceGateway],
})
export class WebsocketModule {}
