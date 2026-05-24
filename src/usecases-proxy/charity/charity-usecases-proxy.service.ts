import { Injectable } from '@nestjs/common';
import { CharityTypeormAdapter } from '../../infrastructure/charity/adapters/charity-typeorm.adapter';
import { CreateCharityLogUsecase } from '../../usecases/charity/create-charity-log.usecase';
import { DeleteCharityLogUsecase } from '../../usecases/charity/delete-charity-log.usecase';
import { GetCharityLogsUsecase } from '../../usecases/charity/get-charity-logs.usecase';
import { GetCharitySummaryUsecase } from '../../usecases/charity/get-charity-summary.usecase';
import { UpdateCharityLogUsecase } from '../../usecases/charity/update-charity-log.usecase';

@Injectable()
export class CharityUsecasesProxyService {
  

  constructor(private readonly persistence: CharityTypeormAdapter) {}

  logs(userId: string, from?: string, to?: string) { return new GetCharityLogsUsecase(this.persistence).execute(userId, from, to); }
  createLog(userId: string, data: any) { return new CreateCharityLogUsecase(this.persistence).execute(userId, data); }
  updateLog(userId: string, id: string, data: any) { return new UpdateCharityLogUsecase(this.persistence).execute(userId, id, data); }
  deleteLog(userId: string, id: string) { return new DeleteCharityLogUsecase(this.persistence).execute(userId, id); }
  summary(userId: string, period: string) { return new GetCharitySummaryUsecase(this.persistence).execute(userId, period); }
}
