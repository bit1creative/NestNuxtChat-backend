import { forwardRef } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { SocketIoGateway } from 'src/socketio/socketio.gateway';
import { SentMessage } from 'src/users/interfaces/sentMessage.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BotsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @Inject(forwardRef(() => SocketIoGateway))
    private socketIoGateway: SocketIoGateway,
  ) {}

  private spamSockets: { [key: string]: Promise<void> } = {};

  spamBot(sendMsg: (socketId: string) => SentMessage, socketId: string): void {
    const spammer = async () => {
      const time = Math.floor(Math.random() * 111) + 10;
      await this.sleep(time * 1000);
      this.userService.newMessage(sendMsg(socketId));
      if (Object.keys(this.spamSockets).find((key) => key === socketId))
        spammer();
    };
    this.spamSockets[socketId] = spammer();
  }

  stopSpamForUser(id): void {
    delete this.spamSockets[id];
  }

  private sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async reverseBot(
    resMessage: SentMessage,
    userSocketId: string,
  ): Promise<void> {
    await this.sleep(3000);
    this.socketIoGateway.sendMessage(
      {
        ...resMessage,
        to: resMessage.interlocutor,
        interlocutor: resMessage.to,
        msg: resMessage.msg.split('').reverse().join(''),
      },
      userSocketId,
    );
  }

  echoBot(resMessage: SentMessage, userSocketId: string): void {
    this.socketIoGateway.sendMessage(
      {
        ...resMessage,
        to: resMessage.interlocutor,
        interlocutor: resMessage.to,
      },
      userSocketId,
    );
  }

  getSpamSockets() {
    return this.spamSockets;
  }
}
