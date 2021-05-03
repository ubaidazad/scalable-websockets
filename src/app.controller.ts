import { Controller, Get, Param, Sse } from '@nestjs/common';
import { interval } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  sendEvent() {
    return this.appService.sendEvent();
  }

  @Get('status/:uuid/:checked')
  changeStatus(@Param('uuid') uuid: string, @Param('checked') checked: number) {
    return this.appService.changeWorkflowStatus(uuid, checked);
  }

  @Sse('sse')
  sse(): Observable<any> {
    console.log('sending ');
    return interval(1000).pipe(
      map((_) => {
        console.log('_: ', _);
        return { data: { hello: 'world' } };
      }),
    );
  }
}
