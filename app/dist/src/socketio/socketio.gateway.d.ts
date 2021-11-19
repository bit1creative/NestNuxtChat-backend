import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';
import { BotsService } from 'src/bots/bot.service';
import { SentMessage } from 'src/users/interfaces/sentMessage.interface';
export declare class SocketIoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private usersService;
    private botsService;
    constructor(usersService: UsersService, botsService: BotsService);
    server: Server;
    private logger;
    handleMessage({ msg, to, interlocutor, date }: {
        msg: any;
        to: any;
        interlocutor: any;
        date: any;
    }): void;
    handleNewLogin(user: User): void;
    handleNewUser(socketId: string): void;
    sendMessage(message: SentMessage, userSocketId: string): void;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
}
