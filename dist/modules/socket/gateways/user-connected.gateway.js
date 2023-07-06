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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsUserConnectedGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const auth_1 = require("../../auth");
const lodash_1 = require("lodash");
const kernel_1 = require("../../../kernel");
const socket_user_service_1 = require("../services/socket-user.service");
const constants_1 = require("../constants");
let WsUserConnectedGateway = class WsUserConnectedGateway {
    constructor(authService, socketUserService, queueEventService) {
        this.authService = authService;
        this.socketUserService = socketUserService;
        this.queueEventService = queueEventService;
    }
    async handleConnection(client) {
        await this.socketUserService.joinGlobalRoom(client);
    }
    async handleDisconnect(client) {
        if (!client.authUser) {
            return;
        }
        const connectionLen = await this.socketUserService.removeConnection(client.authUser.sourceId, client.id);
        if (connectionLen) {
            return;
        }
        if (client.authUser.source === 'user') {
            await this.queueEventService.publish({
                channel: constants_1.USER_SOCKET_CONNECTED_CHANNEL,
                eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                data: client.authUser
            });
        }
        if (client.authUser.source === 'performer') {
            await this.queueEventService.publish({
                channel: constants_1.PERFORMER_SOCKET_CONNECTED_CHANNEL,
                eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                data: client.authUser
            });
        }
        await this.socketUserService.toGlobalRoom('online', {
            id: client.authUser.sourceId,
            online: false
        });
    }
    async handleLogin(client, payload) {
        if (!payload || !payload.token) {
            return;
        }
        await this.login(client, payload.token);
    }
    async handleLogout(client, payload) {
        if (!payload || !payload.token) {
            return;
        }
        await this.logout(client, payload.token);
    }
    async login(client, token) {
        const decodeded = this.authService.verifyJWT(token);
        if (!decodeded) {
            return;
        }
        await this.socketUserService.addConnection(decodeded.sourceId, client.id);
        client.authUser = lodash_1.pick(decodeded, ['source', 'sourceId', 'authId']);
        if (decodeded.source === 'user') {
            await this.queueEventService.publish({
                channel: constants_1.USER_SOCKET_CONNECTED_CHANNEL,
                eventName: constants_1.USER_SOCKET_EVENT.CONNECTED,
                data: client.authUser
            });
        }
        if (decodeded.source === 'performer') {
            await this.queueEventService.publish({
                channel: constants_1.PERFORMER_SOCKET_CONNECTED_CHANNEL,
                eventName: constants_1.USER_SOCKET_EVENT.CONNECTED,
                data: client.authUser
            });
        }
        await this.socketUserService.toGlobalRoom('online', {
            id: client.authUser.sourceId,
            online: true
        });
    }
    async logout(client, token) {
        const decodeded = this.authService.verifyJWT(token);
        if (!decodeded) {
            return;
        }
        if (!client.authUser) {
            return;
        }
        const connectionLen = await this.socketUserService.removeConnection(decodeded.sourceId, client.id);
        if (connectionLen) {
            return;
        }
        client.authUser = lodash_1.pick(decodeded, ['source', 'sourceId', 'authId']);
        if (decodeded.source === 'user') {
            await this.queueEventService.publish({
                channel: constants_1.USER_SOCKET_CONNECTED_CHANNEL,
                eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                data: client.authUser
            });
        }
        if (decodeded.source === 'performer') {
            await this.queueEventService.publish({
                channel: constants_1.PERFORMER_SOCKET_CONNECTED_CHANNEL,
                eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                data: client.authUser
            });
        }
    }
};
__decorate([
    websockets_1.SubscribeMessage('auth/login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], WsUserConnectedGateway.prototype, "handleLogin", null);
__decorate([
    websockets_1.SubscribeMessage('auth/logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], WsUserConnectedGateway.prototype, "handleLogout", null);
WsUserConnectedGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [auth_1.AuthService,
        socket_user_service_1.SocketUserService,
        kernel_1.QueueEventService])
], WsUserConnectedGateway);
exports.WsUserConnectedGateway = WsUserConnectedGateway;
//# sourceMappingURL=user-connected.gateway.js.map