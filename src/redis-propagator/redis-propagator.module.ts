import { Module } from '@nestjs/common';
import { MessagingModule } from 'src/messaging/messaging.module';
import { SocketStateModule } from 'src/socket-state/socket-state.module';

import { RedisModule } from '../redis/redis.module';

import { RedisPropagatorService } from './redis-propagator.service';

@Module({
  imports: [RedisModule, SocketStateModule, MessagingModule],
  providers: [RedisPropagatorService],
  exports: [RedisPropagatorService],
})
export class RedisPropagatorModule {}
