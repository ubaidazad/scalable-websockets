import { UseInterceptors } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  @SubscribeMessage('events')
  public findAll(x, y): Observable<any> {
    console.log('x: ', y);
    return from([1, 2, 3]).pipe(
      map((item) => {
        return { event: 'events', data: item };
      }),
    );
  }
}
