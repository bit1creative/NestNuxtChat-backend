import { Module } from '@nestjs/common';
import { SocketIoModule } from './socketio/socketio.module';

@Module({
  imports: [SocketIoModule],
})
export class AppModule {}
