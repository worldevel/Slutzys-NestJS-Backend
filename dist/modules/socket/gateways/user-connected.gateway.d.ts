import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth';
import { QueueEventService } from 'src/kernel';
import { SocketUserService } from '../services/socket-user.service';
export declare class WsUserConnectedGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    private readonly socketUserService;
    private readonly queueEventService;
    constructor(authService: AuthService, socketUserService: SocketUserService, queueEventService: QueueEventService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleLogin(client: Socket, payload: {
        token: string;
    }): Promise<void>;
    handleLogout(client: Socket, payload: {
        token: string;
    }): Promise<void>;
    login(client: Socket, token: string): Promise<void>;
    logout(client: Socket, token: string): Promise<void>;
}
