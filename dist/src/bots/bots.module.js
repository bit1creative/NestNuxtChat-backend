"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotsModule = void 0;
const common_1 = require("@nestjs/common");
const socketio_module_1 = require("../socketio/socketio.module");
const users_module_1 = require("../users/users.module");
const bot_service_1 = require("./bot.service");
let BotsModule = class BotsModule {
};
BotsModule = __decorate([
    common_1.Module({
        imports: [common_1.forwardRef(() => users_module_1.UsersModule), common_1.forwardRef(() => socketio_module_1.SocketIoModule)],
        providers: [bot_service_1.BotsService],
        exports: [bot_service_1.BotsService],
    })
], BotsModule);
exports.BotsModule = BotsModule;
//# sourceMappingURL=bots.module.js.map