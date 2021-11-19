import { SocketIoGateway } from 'src/socketio/socketio.gateway';
import { SentMessage } from 'src/users/interfaces/sentMessage.interface';
import { UsersService } from 'src/users/users.service';
export declare class BotsService {
    private userService;
    private socketIoGateway;
    constructor(userService: UsersService, socketIoGateway: SocketIoGateway);
    private spamSockets;
    spamBot(sendMsg: (socketId: string) => SentMessage, socketId: string): void;
    stopSpamForUser(id: any): void;
    private sleep;
    reverseBot(resMessage: SentMessage, userSocketId: string): Promise<void>;
    echoBot(resMessage: SentMessage, userSocketId: string): void;
    getSpamSockets(): {
        [key: string]: Promise<void>;
    };
}
