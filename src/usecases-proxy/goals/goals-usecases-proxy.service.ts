import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { GroupMemberRole } from '../../domain/groups/enums/group-member-role.enum';
import { GroupMemberStatus } from '../../domain/groups/enums/group-member-status.enum';
import { GoalsTypeormAdapter } from '../../infrastructure/goals/adapters/goals-typeorm.adapter';
import { GroupsTypeormAdapter } from '../../infrastructure/groups/adapters/groups-typeorm.adapter';
import { PrayerLogsTypeormAdapter } from '../../infrastructure/prayers/adapters/prayer-logs-typeorm.adapter';
import { QuranTypeormAdapter } from '../../infrastructure/quran/adapters/quran-typeorm.adapter';
import { DhikrTypeormAdapter } from '../../infrastructure/dhikr/adapters/dhikr-typeorm.adapter';
import { FastingTypeormAdapter } from '../../infrastructure/fasting/adapters/fasting-typeorm.adapter';
import { CharityTypeormAdapter } from '../../infrastructure/charity/adapters/charity-typeorm.adapter';
import { TafsirTypeormAdapter } from '../../infrastructure/tafsir/adapters/tafsir-typeorm.adapter';
import { CreateGoalProgressUsecase } from '../../usecases/goals/create-goal-progress.usecase';
import { CreateGoalUsecase } from '../../usecases/goals/create-goal.usecase';
import { DeleteGoalUsecase } from '../../usecases/goals/delete-goal.usecase';
import { GetGoalByIdUsecase } from '../../usecases/goals/get-goal-by-id.usecase';
import { GetGoalProgressUsecase } from '../../usecases/goals/get-goal-progress.usecase';
import { GetGoalsUsecase } from '../../usecases/goals/get-goals.usecase';
import { GoalCatalogUsecase } from '../../usecases/goals/goal-catalog.usecase';
import { UpdateGoalUsecase } from '../../usecases/goals/update-goal.usecase';
import { GoalEvaluationService } from '../../usecases/goals/goal-evaluation.service';
import { GoalAnalyticsUsecase } from '../../usecases/goals/goal-analytics.usecase';

@Injectable()
export class GoalsUsecasesProxyService {
  constructor(
    private readonly goals: GoalsTypeormAdapter,
    private readonly groups: GroupsTypeormAdapter,
    private readonly prayers: PrayerLogsTypeormAdapter,
    private readonly quran: QuranTypeormAdapter,
    private readonly dhikr: DhikrTypeormAdapter,
    private readonly fasting: FastingTypeormAdapter,
    private readonly charity: CharityTypeormAdapter,
    private readonly tafsir: TafsirTypeormAdapter,
  ) {}

  async list(userId: string, timezone?: string | null) {
    const catalog = new GoalCatalogUsecase();
    const goals = (await new GetGoalsUsecase(this.goals).execute(userId)).map(
      (goal) => catalog.withCatalogDefinition(goal),
    );
    const evaluations = await this.analyticsUsecase().evaluateCurrent(
      userId,
      goals,
      timezone,
    );
    return goals.map((goal, index) => ({
      ...goal,
      automaticProgress: evaluations[index] ?? undefined,
    }));
  }
  create(userId: string, data: any, timezone?: string | null) {
    return new CreateGoalUsecase(this.goals).execute(
      userId,
      data,
      this.today(timezone),
    );
  }
  catalog(
    category?: import('../../domain/goals/enums/goal-category.enum').GoalCategory,
  ) {
    return new GoalCatalogUsecase().list(category);
  }
  async createGroupGoal(
    userId: string,
    groupId: string,
    data: any,
    timezone?: string | null,
  ) {
    await this.assertCanManageGroupGoals(userId, groupId);
    const materialized = new GoalCatalogUsecase().materialize(
      data,
      this.today(timezone),
    );
    const goal = await this.goals.create({
      ...materialized,
      ownerUserId: userId,
      groupId,
      isGroupGoal: true,
      isActive: true,
    });
    return new GoalCatalogUsecase().withCatalogDefinition(goal);
  }
  async listGroupGoals(userId: string, groupId: string) {
    await this.assertGroupMember(userId, groupId);
    const goals = await this.goals.findByGroupId(groupId);
    const catalog = new GoalCatalogUsecase();
    return goals.map((goal) => catalog.withCatalogDefinition(goal));
  }
  async get(userId: string, id: string, timezone?: string | null) {
    const storedGoal = await new GetGoalByIdUsecase(this.goals).execute(
      userId,
      id,
    );
    const goal = new GoalCatalogUsecase().withCatalogDefinition(storedGoal);
    const [automaticProgress] = await this.analyticsUsecase().evaluateCurrent(
      userId,
      [goal],
      timezone,
    );
    return { ...goal, automaticProgress: automaticProgress ?? undefined };
  }
  async update(userId: string, id: string, data: any) {
    const goal = await new UpdateGoalUsecase(this.goals).execute(
      userId,
      id,
      data,
    );
    return new GoalCatalogUsecase().withCatalogDefinition(goal);
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

  async analytics(
    userId: string,
    input: {
      category?: import('../../domain/goals/enums/goal-category.enum').GoalCategory;
      period?: string;
      anchor?: string;
      timezone?: string | null;
    },
  ) {
    const catalog = new GoalCatalogUsecase();
    const goals = (await this.goals.findByOwnerUserId(userId)).map((goal) =>
      catalog.withCatalogDefinition(goal),
    );
    return this.analyticsUsecase().execute(userId, goals, input);
  }

  private analyticsUsecase() {
    return new GoalAnalyticsUsecase(
      new GoalEvaluationService(
        this.prayers,
        this.quran,
        this.dhikr,
        this.fasting,
        this.charity,
        this.tafsir,
      ),
    );
  }

  private today(timezone?: string | null) {
    const local = timezone ? DateTime.now().setZone(timezone) : DateTime.utc();
    return (local.isValid ? local : DateTime.utc()).toISODate();
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
