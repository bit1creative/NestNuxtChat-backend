export interface User {
  _id: string;
  socketId: string;
  username: string;
  imgUrl: string;
  isOnline: boolean;
  description: string;
  messages: { [interlocutor: string]: Array<Message> };
}

interface Message {
  msg: string;
  date: string;
  fromMe: boolean;
}
