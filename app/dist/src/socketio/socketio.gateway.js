"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIoGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const user_interface_1 = require("../users/interfaces/user.interface");
const users_service_1 = require("../users/users.service");
const bot_service_1 = require("../bots/bot.service");
const sentMessage_interface_1 = require("../users/interfaces/sentMessage.interface");
let SocketIoGateway = class SocketIoGateway {
    constructor(usersService, botsService) {
        this.usersService = usersService;
        this.botsService = botsService;
        this.logger = new common_1.Logger('AppGateway');
    }
    handleMessage({ msg, to, interlocutor, date }) {
        this.usersService.newMessage({ msg, to, interlocutor, date });
        this.server.to(this.usersService.getUser(to).socketId).emit('newMessage', {
            msg,
            interlocutor,
            date,
        });
    }
    handleNewLogin(user) {
        var _a;
        this.usersService.userGoesOnline(user);
        this.server
            .to(user.socketId)
            .emit('loadMessageHistory', (_a = this.usersService.getUser(user.socketId)) === null || _a === void 0 ? void 0 : _a.messages);
        this.server.emit('getUsers', this.usersService.getUsers());
    }
    handleNewUser(socketId) {
        this.usersService.generateRandomUser(socketId);
        this.server
            .to(socketId)
            .emit('generatedNewUser', this.usersService.getUser(socketId));
        this.server.emit('getUsers', this.usersService.getUsers());
    }
    sendMessage(message, userSocketId) {
        this.usersService.newMessage(message);
        this.server.to(userSocketId).emit('newMessage', message);
    }
    afterInit(server) {
        this.logger.log('Init');
    }
    handleDisconnect(client) {
        this.usersService.userGoesOffline(client.id);
        this.botsService.stopSpamForUser(client.id);
        this.server.emit('getUsers', this.usersService.getUsers());
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleConnection(client, ...args) {
        this.logger.log(`Client connected: ${client.id}`);
        this.botsService.spamBot((socketId) => {
            const msg = {
                msg: 'Hello there',
                interlocutor: 'spam_bot',
                date: new Date().toString(),
            };
            this.server.to(socketId).emit('newMessage', msg);
            return Object.assign(Object.assign({}, msg), { to: socketId });
        }, client.id);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], SocketIoGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage('newMessage'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketIoGateway.prototype, "handleMessage", null);
__decorate([
    websockets_1.SubscribeMessage('newLogin'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketIoGateway.prototype, "handleNewLogin", null);
__decorate([
    websockets_1.SubscribeMessage('generateNewUser'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SocketIoGateway.prototype, "handleNewUser", null);
SocketIoGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __param(0, common_1.Inject(common_1.forwardRef(() => users_service_1.UsersService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => bot_service_1.BotsService))),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        bot_service_1.BotsService])
], SocketIoGateway);
exports.SocketIoGateway = SocketIoGateway;
//# sourceMappingURL=socketio.gateway.js.map