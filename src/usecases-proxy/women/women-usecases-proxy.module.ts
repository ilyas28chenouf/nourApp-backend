import { Module } from '@nestjs/common';
import { WomenUsecasesProxyService } from './women-usecases-proxy.service';

@Module({
  providers: [WomenUsecasesProxyService],
  exports: [WomenUsecasesProxyService],
})
export class WomenUsecasesProxyModule {}
