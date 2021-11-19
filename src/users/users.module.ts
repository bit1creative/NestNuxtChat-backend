import { forwardRef, Module } from '@nestjs/common';
import { BotsModule } from 'src/bots/bots.module';
import { UsersService } from './users.service';

@Module({
  imports: [forwardRef(() => BotsModule)],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
