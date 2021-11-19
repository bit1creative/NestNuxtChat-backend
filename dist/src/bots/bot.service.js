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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotsService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const socketio_gateway_1 = require("../socketio/socketio.gateway");
const sentMessage_interface_1 = require("../users/interfaces/sentMessage.interface");
const users_service_1 = require("../users/users.service");
let BotsService = class BotsService {
    constructor(userService, socketIoGateway) {
        this.userService = userService;
        this.socketIoGateway = socketIoGateway;
        this.spamSockets = {};
    }
    spamBot(sendMsg, socketId) {
        const spammer = () => {
            const randomInterval = () => {
                this.userService.newMessage(sendMsg(socketId));
                const time = Math.floor(Math.random() * 111) + 10;
                clearInterval(timer);
                if (Object.keys(this.spamSockets).find((key) => key === socketId))
                    timer = setInterval(randomInterval, time * 1000);
            };
            let timer = setInterval(randomInterval, 10000);
        };
        this.spamSockets[socketId] = spammer;
        spammer();
    }
    stopSpamForUser(id) {
        delete this.spamSockets[id];
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async reverseBot(resMessage, userSocketId) {
        await this.sleep(3000);
        this.socketIoGateway.sendMessage(Object.assign(Object.assign({}, resMessage), { to: resMessage.interlocutor, interlocutor: resMessage.to, msg: resMessage.msg.split('').reverse().join('') }), userSocketId);
    }
    echoBot(resMessage, userSocketId) {
        this.socketIoGateway.sendMessage(Object.assign(Object.assign({}, resMessage), { to: resMessage.interlocutor, interlocutor: resMessage.to }), userSocketId);
    }
    getSpamSockets() {
        return this.spamSockets;
    }
};
BotsService = __decorate([
    common_2.Injectable(),
    __param(0, common_2.Inject(common_1.forwardRef(() => users_service_1.UsersService))),
    __param(1, common_2.Inject(common_1.forwardRef(() => socketio_gateway_1.SocketIoGateway))),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        socketio_gateway_1.SocketIoGateway])
], BotsService);
exports.BotsService = BotsService;
//# sourceMappingURL=bot.service.js.map