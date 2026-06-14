import { Injectable } from '@nestjs/common';
import { GroupMemberRole } from '../../domain/groups/enums/group-member-role.enum';
import { GroupMemberStatus } from '../../domain/groups/enums/group-member-status.enum';
import { GoalsTypeormAdapter } from '../../infrastructure/goals/adapters/goals-typeorm.adapter';
import { GroupsTypeormAdapter } from '../../infrastructure/groups/adapters/groups-typeorm.adapter';
import { CreateGoalProgressUsecase } from '../../usecases/goals/create-goal-progress.usecase';
import { CreateGoalUsecase } from '../../usecases/goals/create-goal.usecase';
import { DeleteGoalUsecase } from '../../usecases/goals/delete-goal.usecase';
import { GetGoalByIdUsecase } from '../../usecases/goals/get-goal-by-id.usecase';
import { GetGoalProgressUsecase } from '../../usecases/goals/get-goal-progress.usecase';
import { GetGoalsUsecase } from '../../usecases/goals/get-goals.usecase';
import { UpdateGoalUsecase } from '../../usecases/goals/update-goal.usecase';

@Injectable()
export class GoalsUsecasesProxyService {
  constructor(
    private readonly goals: GoalsTypeormAdapter,
    private readonly groups: GroupsTypeormAdapter,
  ) {}

  list(userId: string) {
    return new GetGoalsUsecase(this.goals).execute(userId);
  }
  create(userId: string, data: any) {
    return new CreateGoalUsecase(this.goals).execute(userId, data);
  }
  async createGroupGoal(userId: string, groupId: string, data: any) {
    await this.assertCanManageGroupGoals(userId, groupId);
    return this.goals.create({
      ...data,
      ownerUserId: userId,
      groupId,
      isGroupGoal: true,
      isActive: true,
    });
  }
  async listGroupGoals(userId: string, groupId: string) {
    await this.assertGroupMember(userId, groupId);
    return this.goals.findByGroupId(groupId);
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

  private async assertGroupMember(userId: string, groupId: string) {
    const group = await this.groups.findById(groupId);
    if (!group) throw new Error('Group not found');
    const member = await this.groups.findMember(groupId, userId);
    if (!member || member.status !== GroupMemberStatus.ACTIVE)
      throw new Error('Forbidden');
    return member;
  }

  private async assertCanManageGroupGoals(userId: string, groupId: string) {
    const member = await this.assertGroupMember(userId, groupId);
    if (
      member.role !== GroupMemberRole.OWNER &&
      member.role !== GroupMemberRole.ADMIN
    )
      throw new Error('Forbidden');
  }
}
