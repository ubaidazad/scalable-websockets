import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MessagingService {
  constructor(@InjectQueue('message') private messageQueue: Queue) {}

  addMessage(data: any) {
    return this.messageQueue.add(data);
  }
}
