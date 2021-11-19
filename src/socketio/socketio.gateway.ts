import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';
import { BotsService } from 'src/bots/bot.service';
import { SentMessage } from 'src/users/interfaces/sentMessage.interface';

@WebSocketGateway()
export class SocketIoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => BotsService))
    private botsService: BotsService,
  ) {}

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('newMessage')
  handleMessage(@MessageBody() { msg, to, interlocutor, date }): void {
    this.usersService.newMessage({ msg, to, interlocutor, date });
    this.server.to(this.usersService.getUser(to).socketId).emit('newMessage', {
      msg,
      interlocutor,
      date,
    });
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  @SubscribeMessage('newLogin')
  handleNewLogin(@MessageBody() user: User): void {
    this.usersService.userGoesOnline(user);
    this.server
      .to(user.socketId)
      .emit(
        'loadMessageHistory',
        this.usersService.getUser(user.socketId)?.messages,
      );
    this.server.emit('getUsers', this.usersService.getUsers());
  }

  @SubscribeMessage('generateNewUser')
  handleNewUser(@MessageBody() socketId: string): void {
    this.usersService.generateRandomUser(socketId);
    this.server
      .to(socketId)
      .emit('generatedNewUser', this.usersService.getUser(socketId));
    this.server.emit('getUsers', this.usersService.getUsers());
  }

  sendMessage(message: SentMessage, userSocketId: string): void {
    // сохраняю месседж бота юзеру
    this.usersService.newMessage(message);
    this.server.to(userSocketId).emit('newMessage', message);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.usersService.userGoesOffline(client.id);
    this.botsService.stopSpamForUser(client.id);
    this.server.emit('getUsers', this.usersService.getUsers());
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    // Запускаем спам бота для юзера
    this.botsService.spamBot((socketId: string) => {
      const msg = {
        msg: 'Hello there',
        interlocutor: 'spam_bot',
        date: new Date().toString(),
      };
      this.server.to(socketId).emit('newMessage', msg);
      return { ...msg, to: socketId };
    }, client.id);
  }
}
