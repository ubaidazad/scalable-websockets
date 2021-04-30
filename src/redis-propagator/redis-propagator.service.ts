import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Server } from 'socket.io';

import { RedisService } from '../redis/redis.service';
import { SocketStateService } from '../socket-state/socket-state.service';

import { RedisSocketEventEmitDTO } from '../dto/socket-event-emit.dto';
import { RedisSocketEventSendDTO } from '../dto/socket-event-send.dto';
import {
  REDIS_SOCKET_EVENT_EMIT_ALL,
  REDIS_SOCKET_EVENT_SEND,
} from './redis-propagator.constants';
import { MessagingService } from 'src/messaging/messaging.service';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  public constructor(
    private readonly socketStateService: SocketStateService,
    private readonly redisService: RedisService,
    private readonly messagingService: MessagingService,
  ) {
    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_SEND)
      .pipe(tap(this.consumeSendEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_ALL)
      .pipe(tap(this.consumeEmitToAllEvent))
      .subscribe();
  }

  public injectSocketServer(server: Server): RedisPropagatorService {
    this.socketServer = server;

    return this;
  }

  private consumeSendEvent = (eventInfo: RedisSocketEventSendDTO): void => {
    const { userId, event, data, socketId } = eventInfo;

    // return this.socketStateService
    //   .get(userId)
    //   .filter((socket) => socket.id !== socketId)
    //   .forEach((socket) => socket.emit(event, data));

    // get all message for this user


    // console.log('socketid: ', socketId);
    return this.socketStateService
      .get(userId)
      .map((socket) => socket)
      .forEach((socket) => {
        console.log('socket: ', socket);
        socket.emit(event, data);

        // this.messagingService.addMessage({ socketId, data, event })
      });
  };

  private consumeEmitToAllEvent = (
    eventInfo: RedisSocketEventEmitDTO,
  ): void => {
    this.socketServer.emit(eventInfo.event, eventInfo.data);
  };

  public propagateEvent(eventInfo: RedisSocketEventSendDTO): boolean {
    if (!eventInfo.userId) {
      return false;
    }

    this.redisService.publish(REDIS_SOCKET_EVENT_SEND, eventInfo);

    return true;
  }

  public emitToAll(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_ALL, eventInfo);

    return true;
  }
}
