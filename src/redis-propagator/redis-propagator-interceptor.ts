import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { tap } from 'rxjs/operators';
import { RedisPropagatorService } from './redis-propagator.service';

@Injectable()
export class RedisPropagatorInterceptor<T> implements NestInterceptor<T, WsResponse<T>> {
  constructor(private redisPropegatorService: RedisPropagatorService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const socket = context.switchToWs().getClient();


    console.log('interceptor,')
    return next.handle().pipe(
      tap((data) => {
        console.log('data: ', data);
        this.redisPropegatorService.propagateEvent({
          socketId: socket.id,
          userId: socket.auth?.userId,
          ...data,
          // event: '',
        });
      }),
    );
  }
}
