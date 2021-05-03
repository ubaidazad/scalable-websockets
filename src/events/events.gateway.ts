import { UseInterceptors } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { from, interval, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RedisPropagatorInterceptor } from 'src/redis-propagator/redis-propagator-interceptor';

// @UseInterceptors(RedisInterceptor)
// @WebSocketGateway(8888, { transports: ['websocket'] })
// export class EventsGateway {
//   @WebSocketServer()
//   server: Server;

//   @SubscribeMessage('message')
//   handleMessage(client: any, payload: any): string {
//     console.log('payload: ', payload);
    
//     return 'Hello from NestJS websocket!';
//   }

//   handleConnection(server: Server, @Headers() headers: any) {
//     console.log('headers: ', headers);
//     this.server.emit('data', 'hello from server');
//   }
// }


@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway(8888)
export class EventsGateway {
  @SubscribeMessage('download')
  public download(): Observable<any> {
    let progress = 0;
    return interval(1000).pipe(
      take(20),
      map((x) => {
        progress = progress + 5;
        return {
          event: 'events',
          data: {
            cmd: 'DOWNLOAD_PROGRESS',
            progress,
          },
      };
      }),
    );
  }
}
