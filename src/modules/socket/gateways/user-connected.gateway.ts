import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth';
import { pick } from 'lodash';
import { QueueEventService } from 'src/kernel';
import { SocketUserService } from '../services/socket-user.service';
import { USER_SOCKET_CONNECTED_CHANNEL, USER_SOCKET_EVENT, PERFORMER_SOCKET_CONNECTED_CHANNEL } from '../constants';

@WebSocketGateway()
export class WsUserConnectedGateway
implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly socketUserService: SocketUserService,
    private readonly queueEventService: QueueEventService
  ) { }

  async handleConnection(client: Socket): Promise<void> {
    // add socket client to global room to receive socket event
    await this.socketUserService.joinGlobalRoom(client);

    // disable because client will event auth/login event once login success and have token in the app
    // if (!client.handshake.query.token) {
    //   return;
    // }
    // await this.login(client, client.handshake.query.token);
  }

  async handleDisconnect(client: Socket) {
    if (!client.authUser) {
      return;
    }

    const connectionLen = await this.socketUserService.removeConnection(
      client.authUser.sourceId,
      client.id
    );
    if (connectionLen) {
      return;
    }
    if (client.authUser.source === 'user') {
      await this.queueEventService.publish({
        channel: USER_SOCKET_CONNECTED_CHANNEL,
        eventName: USER_SOCKET_EVENT.DISCONNECTED,
        data: client.authUser
      });
    }
    if (client.authUser.source === 'performer') {
      await this.queueEventService.publish({
        channel: PERFORMER_SOCKET_CONNECTED_CHANNEL,
        eventName: USER_SOCKET_EVENT.DISCONNECTED,
        data: client.authUser
      });
    }

    await this.socketUserService.toGlobalRoom('online', {
      id: client.authUser.sourceId,
      online: false
    });
  }

  @SubscribeMessage('auth/login')
  async handleLogin(client: Socket, payload: { token: string }) {
    if (!payload || !payload.token) {
      // client.emit('auth_error', {
      //   message: 'Invalid token!'
      // });
      return;
    }

    await this.login(client, payload.token);
  }

  @SubscribeMessage('auth/logout')
  async handleLogout(client: Socket, payload: { token: string }) {
    if (!payload || !payload.token) {
      return;
    }

    await this.logout(client, payload.token);
  }

  async login(client: Socket, token: string) {
    const decodeded = this.authService.verifyJWT(token);
    if (!decodeded) {
      // client.emit('auth_error', {
      //   message: 'Invalid token!'
      // });
      return;
    }
    await this.socketUserService.addConnection(decodeded.sourceId, client.id);
    // eslint-disable-next-line no-param-reassign
    client.authUser = pick(decodeded, ['source', 'sourceId', 'authId']);
    if (decodeded.source === 'user') {
      await this.queueEventService.publish({
        channel: USER_SOCKET_CONNECTED_CHANNEL,
        eventName: USER_SOCKET_EVENT.CONNECTED,
        data: client.authUser
      });
    }
    if (decodeded.source === 'performer') {
      await this.queueEventService.publish({
        channel: PERFORMER_SOCKET_CONNECTED_CHANNEL,
        eventName: USER_SOCKET_EVENT.CONNECTED,
        data: client.authUser
      });
    }
    await this.socketUserService.toGlobalRoom('online', {
      id: client.authUser.sourceId,
      online: true
    });
  }

  async logout(client: Socket, token: string) {
    const decodeded = this.authService.verifyJWT(token);
    if (!decodeded) {
      // client.emit('auth_error', {
      //   message: 'Invalid token!'
      // });
      return;
    }
    if (!client.authUser) {
      return;
    }
    const connectionLen = await this.socketUserService.removeConnection(decodeded.sourceId, client.id);
    // still have online (eg from another browser, skip to send online/offline event)
    if (connectionLen) {
      return;
    }
    // eslint-disable-next-line no-param-reassign
    client.authUser = pick(decodeded, ['source', 'sourceId', 'authId']);
    if (decodeded.source === 'user') {
      await this.queueEventService.publish({
        channel: USER_SOCKET_CONNECTED_CHANNEL,
        eventName: USER_SOCKET_EVENT.DISCONNECTED,
        data: client.authUser
      });
    }
    if (decodeded.source === 'performer') {
      await this.queueEventService.publish({
        channel: PERFORMER_SOCKET_CONNECTED_CHANNEL,
        eventName: USER_SOCKET_EVENT.DISCONNECTED,
        data: client.authUser
      });
    }
  }
}
