import { Injectable } from '@nestjs/common';
import { RedisPropagatorService } from './redis-propagator/redis-propagator.service';

@Injectable()
export class AppService {
  constructor(private redisPropagatorService: RedisPropagatorService) {}
  sendEvent() {
    console.log('sending event');
    // return true;
    return this.redisPropagatorService.propagateEvent({
      userId: '1234',
      event: 'events',
      data: { data: 'hello' },
      socketId: '',
    });
  }

  changeWorkflowStatus() {
    return this.redisPropagatorService.propagateEvent({
      userId: '1234',
      event: 'events',
      data: {
        cmd: 'UPDATE_WORKFLOW_ACTION',
        data: {
          uuid: '1',
          isChecked: false,
        },
      },
      socketId: '',
    });
  }
}
