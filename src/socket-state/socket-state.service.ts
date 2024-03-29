import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketStateService {
  private socketState = new Map<string, Socket[]>();

  public remove(userId: string, socket: Socket): boolean {
    const existingUserSockets = this.socketState.get(userId);

    if (!existingUserSockets) {
      return true;
    }

    // remove current socket from state
    const sockets = existingUserSockets.filter((s) => s.id !== socket.id);
    if (!sockets.length) {
      this.socketState.delete(userId);
    } else {
      this.socketState.set(userId, sockets);
    }
    return true;
  }

  public add(userId: string, socket: Socket): boolean {
    const existingSockets = this.socketState.get(userId) || [];

    const sockets = [...existingSockets, socket];

    this.socketState.set(userId, sockets);

    return true;
  }

  public get(userId: string): Socket[] {
    return this.socketState.get(userId) || [];
  }
}
