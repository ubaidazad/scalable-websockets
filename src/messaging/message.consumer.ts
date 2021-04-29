import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('message')
export class MessageConsumer {
  @Process()
  sendMessage(job: Job<any>) {
    const { data, event } = job.data;
    console.log('data: ', data);
    console.log('event: ', event);
    return {};
  }
}


/**
 * message
 * serverid:message
 * 

 */