import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'message',
    }),
  ],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
