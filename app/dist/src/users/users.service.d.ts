import { BotsService } from 'src/bots/bot.service';
import { SentMessage } from './interfaces/sentMessage.interface';
import { User } from './interfaces/user.interface';
export declare class UsersService {
    private botsService;
    constructor(botsService: BotsService);
    private users;
    addUser(user: User): void;
    userGoesOnline(user: User): void;
    userGoesOffline(socketId: string): void;
    getUser(id: string): User;
    getUsers(): User[];
    newMessage({ msg, to, interlocutor, date }: SentMessage): void;
    messageToBot({ msg, to, interlocutor, date }: SentMessage, userSocketId: string): void;
    generateRandomUser(socketId: any): void;
}
