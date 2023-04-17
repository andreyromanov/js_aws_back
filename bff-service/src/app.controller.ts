import { Controller, All, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('/*')
  async getHello(@Req() request: Request): Promise<string> {
    return this.appService.proxyRequest(request);
  }
}
