import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIOAdapter from 'socket.io-redis';

export class RedisIOAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    const redisAdapter = redisIOAdapter({ host: 'localhost', port: 6379 });

    server.adapter(redisAdapter);
    return server;
  }
}
