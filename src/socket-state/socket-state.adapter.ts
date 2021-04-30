import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import socketio from 'socket.io';

import { RedisPropagatorService } from '../redis-propagator/redis-propagator.service';

import { SocketStateService } from './socket-state.service';

interface TokenPayload {
  readonly userId: string;
}

export interface AuthenticatedSocket extends socketio.Socket {
  auth: TokenPayload;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
  ) {
    super(app);
  }

  public create(port: number, options: socketio.ServerOptions = {}): socketio.Server {
    const server = super.createIOServer(port, options);
    this.redisPropagatorService.injectSocketServer(server);

    server.use(async (socket: AuthenticatedSocket, next) => {
      try {
        // fake auth to simulate authentication process
        socket.auth = {
          userId: '1234',
        };

        return next();
      } catch (e) {
        return next(e);
      }
    });

    return server;
  }

  public bindClientConnect(server: socketio.Server, callback: Function): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`connection established with socketid ${socket.id}`);
      if (socket.auth) {
        // add socket to state for later use
        this.socketStateService.add(socket.auth.userId, socket);
      }

      socket.on('disconnect', () => {
        this.socketStateService.remove(socket.auth.userId, socket);
        socket.removeAllListeners('disconnect');
      });

      callback(socket);
    });
  }
}
