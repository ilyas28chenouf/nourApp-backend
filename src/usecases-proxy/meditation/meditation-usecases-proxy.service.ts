import { Injectable } from '@nestjs/common';
import { MeditationTypeormAdapter } from '../../infrastructure/meditation/adapters/meditation-typeorm.adapter';
import { CreateMeditationLogUsecase } from '../../usecases/meditation/create-meditation-log.usecase';
import { DeleteMeditationLogUsecase } from '../../usecases/meditation/delete-meditation-log.usecase';
import { GetMeditationLogsUsecase } from '../../usecases/meditation/get-meditation-logs.usecase';
import { UpdateMeditationLogUsecase } from '../../usecases/meditation/update-meditation-log.usecase';

@Injectable()
export class MeditationUsecasesProxyService {
  constructor(private readonly persistence: MeditationTypeormAdapter) {}

  logs(userId: string, from?: string, to?: string) {
    return new GetMeditationLogsUsecase(this.persistence).execute(
      userId,
      from,
      to,
    );
  }
  createLog(userId: string, data: any) {
    return new CreateMeditationLogUsecase(this.persistence).execute(
      userId,
      data,
    );
  }
  updateLog(userId: string, id: string, data: any) {
    return new UpdateMeditationLogUsecase(this.persistence).execute(
      userId,
      id,
      data,
    );
  }
  deleteLog(userId: string, id: string) {
    return new DeleteMeditationLogUsecase(this.persistence).execute(userId, id);
  }
}
