"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIoModule = void 0;
const common_1 = require("@nestjs/common");
const bots_module_1 = require("../bots/bots.module");
const users_module_1 = require("../users/users.module");
const socketio_gateway_1 = require("./socketio.gateway");
let SocketIoModule = class SocketIoModule {
};
SocketIoModule = __decorate([
    common_1.Module({
        imports: [users_module_1.UsersModule, bots_module_1.BotsModule],
        providers: [socketio_gateway_1.SocketIoGateway],
        exports: [socketio_gateway_1.SocketIoGateway],
    })
], SocketIoModule);
exports.SocketIoModule = SocketIoModule;
//# sourceMappingURL=socketio.module.js.map