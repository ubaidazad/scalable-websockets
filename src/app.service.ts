import { Injectable } from '@nestjs/common';
import { RedisPropagatorService } from './redis-propagator/redis-propagator.service';

@Injectable()
export class AppService {
  constructor(private redisPropagatorService: RedisPropagatorService) {}
  sendEvent() {
    console.log('sending event');
    return true;
    // return this.redisPropagatorService.propagateEvent({
    //   userId: 'hardcoded_user_id',
    //   event: 'data',
    //   data: {},
    //   socketId: '',
    // });
  }
}
