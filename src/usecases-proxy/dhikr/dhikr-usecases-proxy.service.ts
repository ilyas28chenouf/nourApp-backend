import { Injectable } from '@nestjs/common';
import { DhikrTypeormAdapter } from '../../infrastructure/dhikr/adapters/dhikr-typeorm.adapter';
import { CreateDhikrLogUsecase } from '../../usecases/dhikr/create-dhikr-log.usecase';
import { GetDhikrItemsUsecase } from '../../usecases/dhikr/get-dhikr-items.usecase';
import { GetDhikrLogsUsecase } from '../../usecases/dhikr/get-dhikr-logs.usecase';
import { UpdateDhikrLogUsecase } from '../../usecases/dhikr/update-dhikr-log.usecase';

@Injectable()
export class DhikrUsecasesProxyService {
  

  constructor(private readonly dhikr: DhikrTypeormAdapter) {}

  items() { return new GetDhikrItemsUsecase(this.dhikr).execute(); }
  logs(userId: string, date?: string) { return new GetDhikrLogsUsecase(this.dhikr).execute(userId, date); }
  createLog(userId: string, data: any) { return new CreateDhikrLogUsecase(this.dhikr).execute(userId, data); }
  updateLog(userId: string, id: string, data: any) { return new UpdateDhikrLogUsecase(this.dhikr).execute(userId, id, data); }
}
