import { Module } from '@nestjs/common';
// import { BotsService } from 'src/bots/bot.service';
import { BotsModule } from 'src/bots/bots.module';
import { UsersModule } from 'src/users/users.module';
import { SocketIoGateway } from './socketio.gateway';

@Module({
  imports: [UsersModule, BotsModule],
  providers: [SocketIoGateway],
  exports: [SocketIoGateway],
})
export class SocketIoModule {}
