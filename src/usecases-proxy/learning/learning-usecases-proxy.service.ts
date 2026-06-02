import { Injectable } from '@nestjs/common';
import { LearningTypeormAdapter } from '../../infrastructure/learning/adapters/learning-typeorm.adapter';
import { GetLearningItemByIdUsecase } from '../../usecases/learning/get-learning-item-by-id.usecase';
import { GetLearningItemsUsecase } from '../../usecases/learning/get-learning-items.usecase';
import { GetUserLearningProgressUsecase } from '../../usecases/learning/get-user-learning-progress.usecase';
import { UpdateUserLearningProgressUsecase } from '../../usecases/learning/update-user-learning-progress.usecase';

@Injectable()
export class LearningUsecasesProxyService {
  constructor(private readonly learning: LearningTypeormAdapter) {}

  items() {
    return new GetLearningItemsUsecase(this.learning).execute();
  }
  item(id: string) {
    return new GetLearningItemByIdUsecase(this.learning).execute(id);
  }
  progress(userId: string) {
    return new GetUserLearningProgressUsecase(this.learning).execute(userId);
  }
  createProgress(userId: string, data: any) {
    return new UpdateUserLearningProgressUsecase(this.learning).execute(
      userId,
      data,
    );
  }
  updateProgress(userId: string, id: string, data: any) {
    return new UpdateUserLearningProgressUsecase(this.learning).execute(
      userId,
      id,
      data,
    );
  }
}
