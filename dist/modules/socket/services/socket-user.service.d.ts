import { RedisService } from 'nestjs-redis';
import { ObjectId } from 'mongodb';
import { Server, Socket } from 'socket.io';
import { AgendaService, QueueEventService } from 'src/kernel';
export declare const CONNECTED_USER_REDIS_KEY = "connected_users";
export declare class SocketUserService {
    private readonly agenda;
    private readonly redisService;
    private readonly queueEventService;
    server: Server;
    constructor(agenda: AgendaService, redisService: RedisService, queueEventService: QueueEventService);
    addConnection(sourceId: string | ObjectId, socketId: string): Promise<void>;
    removeConnection(sourceId: string | ObjectId, socketId: string): Promise<number>;
    emitToUsers(userIds: string | string[] | ObjectId | ObjectId[], eventName: string, data: any): Promise<void>;
    private defineJobs;
    private scheduleOfflineSockets;
    joinGlobalRoom(socket: Socket): Promise<any>;
    toGlobalRoom(eventName: string, data: any): Promise<any>;
}
