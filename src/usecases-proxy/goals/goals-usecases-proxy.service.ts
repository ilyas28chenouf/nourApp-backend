import { Injectable } from '@nestjs/common';
import { GoalsTypeormAdapter } from '../../infrastructure/goals/adapters/goals-typeorm.adapter';
import { CreateGoalProgressUsecase } from '../../usecases/goals/create-goal-progress.usecase';
import { CreateGoalUsecase } from '../../usecases/goals/create-goal.usecase';
import { DeleteGoalUsecase } from '../../usecases/goals/delete-goal.usecase';
import { GetGoalByIdUsecase } from '../../usecases/goals/get-goal-by-id.usecase';
import { GetGoalProgressUsecase } from '../../usecases/goals/get-goal-progress.usecase';
import { GetGoalsUsecase } from '../../usecases/goals/get-goals.usecase';
import { UpdateGoalUsecase } from '../../usecases/goals/update-goal.usecase';

@Injectable()
export class GoalsUsecasesProxyService {
  constructor(private readonly goals: GoalsTypeormAdapter) {}

  list(userId: string) {
    return new GetGoalsUsecase(this.goals).execute(userId);
  }
  create(userId: string, data: any) {
    return new CreateGoalUsecase(this.goals).execute(userId, data);
  }
  get(userId: string, id: string) {
    return new GetGoalByIdUsecase(this.goals).execute(userId, id);
  }
  update(userId: string, id: string, data: any) {
    return new UpdateGoalUsecase(this.goals).execute(userId, id, data);
  }
  delete(userId: string, id: string) {
    return new DeleteGoalUsecase(this.goals).execute(userId, id);
  }
  addProgress(userId: string, goalId: string, data: any) {
    return new CreateGoalProgressUsecase(this.goals).execute(
      userId,
      goalId,
      data,
    );
  }
  progress(userId: string, goalId: string) {
    return new GetGoalProgressUsecase(this.goals).execute(userId, goalId);
  }
}
