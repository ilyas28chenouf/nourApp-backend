import { Module } from '@nestjs/common';
import { DiaryUsecasesProxyService } from './diary-usecases-proxy.service';

@Module({
  providers: [DiaryUsecasesProxyService],
  exports: [DiaryUsecasesProxyService],
})
export class DiaryUsecasesProxyModule {}
