import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BotsService } from 'src/bots/bot.service';
import { SentMessage } from './interfaces/sentMessage.interface';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => BotsService))
    private botsService: BotsService,
  ) {}

  private users: User[] = [
    {
      username: 'Echo bot',
      _id: 'echo_bot',
      imgUrl: 'https://miro.medium.com/max/1033/1*MAsNORFL89roPfIFMBnA4A.jpeg',
      isOnline: true,
      description: 'Im Echo - bot that sends you back your message.',
      socketId: 'echo_bot',
      messages: {},
    },
    {
      username: 'Reverse bot',
      _id: 'reverse_bot',
      imgUrl: 'https://miro.medium.com/max/1033/1*MAsNORFL89roPfIFMBnA4A.jpeg',
      isOnline: true,
      description:
        'Im Reverse - bot that sends you back your message reversed.',
      socketId: 'reverse_bot',
      messages: {},
    },
    {
      username: 'Spam bot',
      _id: 'spam_bot',
      imgUrl: 'https://miro.medium.com/max/1033/1*MAsNORFL89roPfIFMBnA4A.jpeg',
      isOnline: true,
      description: 'Im Spam - bot that spams.',
      socketId: 'spam_bot',
      messages: {},
    },
    {
      username: 'Ignore bot',
      _id: 'ignore_bot',
      imgUrl: 'https://miro.medium.com/max/1033/1*MAsNORFL89roPfIFMBnA4A.jpeg',
      isOnline: true,
      description: 'Im Ignore - bot that fully ignores you.',
      socketId: 'ignore_bot',
      messages: {},
    },
  ];

  addUser(user: User) {
    if (
      this.users.find(
        (existUser) =>
          existUser._id.trim().toLowerCase() === user._id.trim().toLowerCase(),
      )
    )
      throw new Error('User already exists.');
    else this.users.push(user);
  }

  userGoesOnline(user: User): void {
    if (!this.getUser(user._id)) {
      this.users.push({ ...user, isOnline: true });
      return;
    }
    const index = this.users.findIndex(
      (existUser) => existUser._id === user._id,
    );
    this.users[index] = {
      ...this.users[index],
      isOnline: true,
      // Обнова сокета, чтобы после дисконнекта одного, второй был в онлайне
      socketId: user.socketId,
    };
  }

  userGoesOffline(socketId: string) {
    if (!this.getUser(socketId)) {
      return;
    }
    const index = this.users.findIndex(
      (existUser) => existUser.socketId === socketId,
    );
    this.users[index] = {
      ...this.users[index],
      isOnline: false,
    };
  }

  getUser(id: string) {
    return this.users.find(
      (existUser) => existUser._id === id || existUser.socketId === id,
    );
  }

  getUsers(): User[] {
    return this.users;
  }

  newMessage({ msg, to, interlocutor, date }: SentMessage): void {
    const index_to = this.users.findIndex(
      (user) => user._id === to || user.socketId === to,
    );
    const index_from = this.users.findIndex(
      (user) => user._id === interlocutor,
    );

    // делаю проверку на чат с ботом, чтобы не схоранять ему сообщения
    const toBot = to.endsWith('bot');

    const fromBot = interlocutor.endsWith('bot');
    if (!toBot && this.users[index_to]) {
      if (this.users[index_to].messages[interlocutor]) {
        this.users[index_to].messages[interlocutor] = [
          ...this.users[index_to].messages[interlocutor],
          { msg, date, fromMe: false },
        ];
      } else
        this.users[index_to].messages[interlocutor] = [
          { msg, date, fromMe: false },
        ];
    }
    if (!fromBot && this.users[index_from]) {
      if (this.users[index_from].messages[to]) {
        this.users[index_from].messages[to] = [
          ...this.users[index_from].messages[to],
          { msg, date, fromMe: true },
        ];
      } else
        this.users[index_from].messages[to] = [{ msg, date, fromMe: true }];
    }
    if (toBot) {
      this.messageToBot(
        { msg, to, interlocutor, date },
        this.users[index_from].socketId,
      );
    }
  }

  messageToBot(
    { msg, to, interlocutor, date }: SentMessage,
    userSocketId: string,
  ) {
    switch (to.slice(0, to.length - 4)) {
      case 'reverse':
        this.botsService.reverseBot(
          {
            to,
            interlocutor,
            date,
            msg,
          },
          userSocketId,
        );
        break;
      case 'echo':
        this.botsService.echoBot({ msg, to, interlocutor, date }, userSocketId);
        break;
      default:
        break;
    }
  }

  generateRandomUser(socketId): void {
    const _user = {
      _id: '_' + Math.random().toString(36).substr(2, 9),
      username: Math.random().toString(36).substring(7),
      imgUrl: [
        'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg',
        'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZGF3bnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
        'https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg',
        'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
      ][Math.floor(Math.random() * 4)],
      description: Math.random().toString(36).substr(1, 50),
      isOnline: true,
      socketId,
      messages: {},
    };
    if (this.users.find((user) => user._id === _user._id))
      return this.generateRandomUser(socketId);
    this.users.push(_user);
  }
}
