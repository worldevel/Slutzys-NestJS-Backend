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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketUserService = exports.CONNECTED_USER_REDIS_KEY = void 0;
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("nestjs-redis");
const lodash_1 = require("lodash");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
exports.CONNECTED_USER_REDIS_KEY = 'connected_users';
const SCHEDULE_OFFLINE_SOCKETS = 'SCHEDULE_OFFLINE_SOCKETS';
let SocketUserService = class SocketUserService {
    constructor(agenda, redisService, queueEventService) {
        this.agenda = agenda;
        this.redisService = redisService;
        this.queueEventService = queueEventService;
        this.defineJobs();
    }
    async addConnection(sourceId, socketId) {
        const redisClient = this.redisService.getClient();
        await redisClient.sadd(exports.CONNECTED_USER_REDIS_KEY, sourceId.toString());
        await redisClient.sadd(sourceId.toString(), socketId);
    }
    async removeConnection(sourceId, socketId) {
        const redisClient = this.redisService.getClient();
        await redisClient.srem(sourceId.toString(), socketId);
        const len = await redisClient.scard(sourceId.toString());
        if (!len) {
            await redisClient.srem(exports.CONNECTED_USER_REDIS_KEY, sourceId.toString());
        }
        return len;
    }
    async emitToUsers(userIds, eventName, data) {
        const stringIds = lodash_1.uniq(Array.isArray(userIds) ? userIds : [userIds]).map((i) => i.toString());
        const redisClient = this.redisService.getClient();
        Promise.all(stringIds.map(async (userId) => {
            const socketIds = await redisClient.smembers(userId);
            (socketIds || []).forEach((socketId) => this.server.to(socketId).emit(eventName, data));
        }));
    }
    async defineJobs() {
        const collection = this.agenda._collection;
        await collection.deleteMany({
            name: {
                $in: [SCHEDULE_OFFLINE_SOCKETS]
            }
        });
        this.agenda.define(SCHEDULE_OFFLINE_SOCKETS, {}, this.scheduleOfflineSockets.bind(this));
        this.agenda.schedule('10 seconds from now', SCHEDULE_OFFLINE_SOCKETS, {});
    }
    async scheduleOfflineSockets(job, done) {
        try {
            const redisClient = this.redisService.getClient();
            const onlineUserIds = await redisClient.smembers(exports.CONNECTED_USER_REDIS_KEY);
            await onlineUserIds.reduce(async (previousPromise, userId) => {
                await previousPromise;
                const socketIds = await redisClient.smembers(userId);
                const connectedSockets = Object.keys(this.server.eio.clients);
                let hasOnline = false;
                await socketIds.reduce(async (lP, socketId) => {
                    await lP;
                    if (connectedSockets.includes(socketId)) {
                        hasOnline = true;
                    }
                    else {
                        await redisClient.srem(userId, socketId);
                    }
                    return Promise.resolve();
                }, Promise.resolve());
                if (!hasOnline) {
                    await redisClient.srem(exports.CONNECTED_USER_REDIS_KEY, userId);
                    await this.queueEventService.publish({
                        channel: constants_1.USER_SOCKET_CONNECTED_CHANNEL,
                        eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                        data: {
                            source: 'user',
                            sourceId: userId
                        }
                    });
                    await this.queueEventService.publish({
                        channel: constants_1.PERFORMER_SOCKET_CONNECTED_CHANNEL,
                        eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                        data: {
                            source: 'performer',
                            sourceId: userId
                        }
                    });
                    await this.toGlobalRoom('online', {
                        id: userId,
                        online: false
                    });
                }
                return Promise.resolve();
            }, Promise.resolve());
        }
        catch (e) {
            console.log('Schedule offline socket error', e);
        }
        finally {
            job.remove();
            this.agenda.schedule('2 minutes from now', SCHEDULE_OFFLINE_SOCKETS, {});
            typeof done === 'function' && done();
        }
    }
    async joinGlobalRoom(socket) {
        return socket.join(constants_1.SOCKET_GLOBAL_ROOM);
    }
    async toGlobalRoom(eventName, data) {
        return this.server.to(constants_1.SOCKET_GLOBAL_ROOM).emit(eventName, data);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], SocketUserService.prototype, "server", void 0);
SocketUserService = __decorate([
    common_1.Injectable(),
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [kernel_1.AgendaService,
        nestjs_redis_1.RedisService,
        kernel_1.QueueEventService])
], SocketUserService);
exports.SocketUserService = SocketUserService;
//# sourceMappingURL=socket-user.service.js.map