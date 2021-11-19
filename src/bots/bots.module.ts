import { forwardRef, Module } from '@nestjs/common';
import { SocketIoModule } from 'src/socketio/socketio.module';
import { UsersModule } from 'src/users/users.module';
import { BotsService } from './bot.service';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => SocketIoModule)],
  providers: [BotsService],
  exports: [BotsService],
})
export class BotsModule {}
