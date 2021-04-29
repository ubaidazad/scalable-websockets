import { NestFactory } from '@nestjs/core';
// import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';
import { RedisIOAdapter } from './redis-io-adapter';
import { RedisPropagatorService } from './redis-propagator/redis-propagator.service';
import { SocketStateAdapter } from './socket-state/socket-state.adapter';
import { SocketStateService } from './socket-state/socket-state.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // use custom adapter
  // app.useWebSocketAdapter(new RedisIOAdapter(app));

  const socketStateService = app.get(SocketStateService);
  const redisPropagatorService = app.get(RedisPropagatorService);

  app.useWebSocketAdapter(
    new SocketStateAdapter(app, socketStateService, redisPropagatorService),
  );

  await app.listen(3000);
}
bootstrap();
