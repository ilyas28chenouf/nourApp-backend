import { Injectable } from '@nestjs/common';
import { HasanatSourceType } from '../../domain/progression/enums/hasanat-source-type.enum';
import { CharityTypeormAdapter } from '../../infrastructure/charity/adapters/charity-typeorm.adapter';
import { CreateCharityLogUsecase } from '../../usecases/charity/create-charity-log.usecase';
import { DeleteCharityLogUsecase } from '../../usecases/charity/delete-charity-log.usecase';
import { GetCharityLogsUsecase } from '../../usecases/charity/get-charity-logs.usecase';
import { GetCharitySummaryUsecase } from '../../usecases/charity/get-charity-summary.usecase';
import { UpdateCharityLogUsecase } from '../../usecases/charity/update-charity-log.usecase';
import { ProgressionService } from '../progression/progression.service';

@Injectable()
export class CharityUsecasesProxyService {
  constructor(
    private readonly persistence: CharityTypeormAdapter,
    private readonly progression: ProgressionService,
  ) {}

  logs(userId: string, from?: string, to?: string) {
    return new GetCharityLogsUsecase(this.persistence).execute(
      userId,
      from,
      to,
    );
  }
  async createLog(userId: string, data: any) {
    const log = await new CreateCharityLogUsecase(this.persistence).execute(
      userId,
      data,
    );
    await this.progression.recordCharityLog(log);
    return log;
  }
  async updateLog(userId: string, id: string, data: any) {
    const log = await new UpdateCharityLogUsecase(this.persistence).execute(
      userId,
      id,
      data,
    );
    await this.progression.recordCharityLog(log);
    return log;
  }
  async deleteLog(userId: string, id: string) {
    const existing = await this.persistence.findById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    const result = await new DeleteCharityLogUsecase(this.persistence).execute(
      userId,
      id,
    );
    await this.progression.reverseEventsForLog(
      userId,
      HasanatSourceType.CHARITY,
      id,
      existing.charityDate,
    );
    return result;
  }
  summary(userId: string, period: string) {
    return new GetCharitySummaryUsecase(this.persistence).execute(
      userId,
      period,
    );
  }
}
