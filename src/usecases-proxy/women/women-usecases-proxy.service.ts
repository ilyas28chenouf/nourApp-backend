import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  diffDateOnlyInDays,
  eachDateOnlyBetween,
  isDateOnlyInRange,
  requireDateOnly,
  todayDateOnly,
} from '../../common-utils/dates/date-format.util';
import { WomenProgramActivityKey } from '../../domain/women/enums/women-program-activity-key.enum';
import { WomenProgramCycleStatus } from '../../domain/women/enums/women-program-cycle-status.enum';
import { WomenProgramDayStatus } from '../../domain/women/enums/women-program-day-status.enum';
import { WomenProgramActivityLogTypeormEntity } from '../../infrastructure/women/entities/women-program-activity-log.typeorm-entity';
import { WomenProgramCycleTypeormEntity } from '../../infrastructure/women/entities/women-program-cycle.typeorm-entity';
import { WomenPeriodLogTypeormEntity } from '../../infrastructure/women/entities/women-period-log.typeorm-entity';

const WOMEN_PROGRAM_ACTIVITIES_TOTAL = 4;
const WOMEN_PROGRAM_ACTIVITY_KEYS = Object.values(WomenProgramActivityKey);

const BOOLEAN_FIELDS = [
  'quran',
  'dhikr',
  'doua',
  'reading',
  'sadaka',
  'meditation',
  'hadith',
  'health',
] as const;

@Injectable()
export class WomenUsecasesProxyService {
  private readonly logs: Repository<WomenPeriodLogTypeormEntity>;
  private readonly programs: Repository<WomenProgramCycleTypeormEntity>;
  private readonly activities: Repository<WomenProgramActivityLogTypeormEntity>;

  constructor(dataSource: DataSource) {
    this.logs = dataSource.getRepository(WomenPeriodLogTypeormEntity);
    this.programs = dataSource.getRepository(WomenProgramCycleTypeormEntity);
    this.activities = dataSource.getRepository(
      WomenProgramActivityLogTypeormEntity,
    );
  }

  list(userId: string, from?: string, to?: string) {
    const qb = this.logs
      .createQueryBuilder('log')
      .where('log.userId = :userId', { userId })
      .orderBy('log.date', 'DESC')
      .addOrderBy('log.createdAt', 'DESC');

    if (from) qb.andWhere('log.date >= :from', { from });
    if (to) qb.andWhere('log.date <= :to', { to });
    return qb.getMany();
  }

  create(userId: string, data: any) {
    return this.logs.save(
      this.logs.create({
        userId,
        ...this.withBooleanDefaults(data),
      }),
    );
  }

  async get(userId: string, id: string) {
    const log = await this.logs.findOne({ where: { id, userId } });
    if (!log) throw new NotFoundException('Women period log not found');
    return log;
  }

  async update(userId: string, id: string, data: any) {
    const existing = await this.get(userId, id);
    return this.logs.save({ ...existing, ...this.stripUndefined(data) });
  }

  async delete(userId: string, id: string) {
    const existing = await this.get(userId, id);
    await this.logs.delete(existing.id);
    return { deleted: true };
  }

  async summary(userId: string, from: string, to: string) {
    const logs = await this.list(userId, from, to);
    const totals = Object.fromEntries(
      BOOLEAN_FIELDS.map((field) => [
        field,
        logs.filter((log) => Boolean(log[field])).length,
      ]),
    );

    return {
      userId,
      from,
      to,
      totalDays: logs.length,
      totals,
    };
  }

  async startProgram(userId: string, data: any) {
    const existingActive = await this.programs.findOne({
      where: { userId, status: WomenProgramCycleStatus.ACTIVE },
    });
    if (existingActive) {
      throw new ConflictException(
        'An active women program already exists for this user',
      );
    }

    const startDate = requireDateOnly(
      data?.startDate ?? todayDateOnly(),
      'startDate',
    );
    const expectedDays = data?.expectedDays ?? 8;
    const program = await this.programs.save(
      this.programs.create({
        userId,
        startDate,
        expectedDays,
        status: WomenProgramCycleStatus.ACTIVE,
      }),
    );

    if (data?.markPeriodDay === true) {
      await this.ensurePeriodLog(userId, startDate);
    }

    const activitiesCompleted = await this.countCompletedActivities(
      userId,
      program.id,
      startDate,
    );
    return {
      ...this.toProgramResponse(program, startDate),
      today: {
        date: startDate,
        programDay: 1,
        activitiesCompleted,
        activitiesTotal: WOMEN_PROGRAM_ACTIVITIES_TOTAL,
      },
    };
  }

  async currentProgram(userId: string, date?: string) {
    const requestedDate = requireDateOnly(date ?? todayDateOnly(), 'date');
    const program = await this.programs.findOne({
      where: { userId, status: WomenProgramCycleStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
    if (!program) {
      return {
        hasActiveProgram: false,
        program: null,
        today: null,
      };
    }

    const programDay = this.getProgramDay(program, requestedDate);
    const activitiesCompleted = await this.countCompletedActivities(
      userId,
      program.id,
      requestedDate,
    );
    return {
      hasActiveProgram: true,
      program: this.toProgramResponse(program, requestedDate),
      today: {
        date: requestedDate,
        programDay,
        isToday: requestedDate === todayDateOnly(),
        isPeriodMarked: await this.isPeriodMarked(userId, requestedDate),
        activitiesCompleted,
        activitiesTotal: WOMEN_PROGRAM_ACTIVITIES_TOTAL,
      },
    };
  }

  async stopProgram(userId: string, id: string, data: any) {
    const program = await this.getProgram(userId, id);
    this.assertActiveProgram(program);
    const endDate = requireDateOnly(data?.endDate, 'endDate');
    this.assertEndDateIsValid(program, endDate);
    const updated = await this.programs.save({
      ...program,
      status: WomenProgramCycleStatus.STOPPED,
      endDate,
      stopReason: data?.reason ?? null,
    });
    return {
      id: updated.id,
      status: updated.status,
      startDate: updated.startDate,
      endDate: updated.endDate,
      totalDays: diffDateOnlyInDays(endDate, updated.startDate) + 1,
    };
  }

  async completeProgram(userId: string, id: string, data: any) {
    const program = await this.getProgram(userId, id);
    this.assertActiveProgram(program);
    const endDate = requireDateOnly(data?.endDate, 'endDate');
    this.assertEndDateIsValid(program, endDate);
    const updated = await this.programs.save({
      ...program,
      status: WomenProgramCycleStatus.COMPLETED,
      endDate,
    });
    return {
      id: updated.id,
      status: updated.status,
      startDate: updated.startDate,
      endDate: updated.endDate,
      totalDays: diffDateOnlyInDays(endDate, updated.startDate) + 1,
    };
  }

  async programDays(userId: string, id: string, from: string, to: string) {
    const program = await this.getProgram(userId, id);
    const fromDate = requireDateOnly(from, 'from');
    const toDate = requireDateOnly(to, 'to');
    if (toDate < fromDate) {
      throw new BadRequestException('to must be greater than or equal to from');
    }

    const start = fromDate > program.startDate ? fromDate : program.startDate;
    const programEnd = program.endDate ?? toDate;
    const end = toDate < programEnd ? toDate : programEnd;
    if (end < start) return [];

    const dates = eachDateOnlyBetween(start, end);
    const periodDates = await this.getPeriodDateSet(userId, start, end);
    const activityCounts = await this.getCompletedActivityCounts(
      userId,
      program.id,
      start,
      end,
    );
    const today = todayDateOnly();

    return dates.map((date) => {
      const activitiesCompleted = activityCounts.get(date) ?? 0;
      return {
        date,
        programDay: this.getProgramDay(program, date),
        isToday: date === today,
        isPeriodMarked: periodDates.has(date),
        activitiesCompleted,
        activitiesTotal: WOMEN_PROGRAM_ACTIVITIES_TOTAL,
        status: this.getDayStatus(activitiesCompleted),
      };
    });
  }

  async updateProgramActivity(
    userId: string,
    id: string,
    date: string,
    activityKey: string,
    data: any,
  ) {
    const program = await this.getProgram(userId, id);
    const dateOnly = requireDateOnly(date, 'date');
    this.assertDateBelongsToProgram(program, dateOnly);
    if (!WOMEN_PROGRAM_ACTIVITY_KEYS.includes(activityKey as any)) {
      throw new BadRequestException('Invalid women program activity key');
    }

    const programDay = this.getProgramDay(program, dateOnly);
    const existing = await this.activities.findOne({
      where: {
        userId,
        programId: program.id,
        date: dateOnly,
        activityKey: activityKey as WomenProgramActivityKey,
      },
    });
    const completed = Boolean(data?.completed);
    const activity = await this.activities.save(
      this.activities.create({
        ...(existing ?? {}),
        userId,
        programId: program.id,
        date: dateOnly,
        programDay,
        activityKey: activityKey as WomenProgramActivityKey,
        completed,
        completedAt: completed ? new Date() : null,
      }),
    );
    const activitiesCompleted = await this.countCompletedActivities(
      userId,
      program.id,
      dateOnly,
    );

    return {
      date: activity.date,
      programDay: activity.programDay,
      activityKey: activity.activityKey,
      completed: activity.completed,
      activitiesCompleted,
      activitiesTotal: WOMEN_PROGRAM_ACTIVITIES_TOTAL,
    };
  }

  history(userId: string, from?: string, to?: string) {
    const qb = this.programs
      .createQueryBuilder('program')
      .where('program.userId = :userId', { userId })
      .orderBy('program.startDate', 'DESC');

    if (from) {
      const fromDate = requireDateOnly(from, 'from');
      qb.andWhere('(program.endDate IS NULL OR program.endDate >= :fromDate)', {
        fromDate,
      });
    }
    if (to) {
      const toDate = requireDateOnly(to, 'to');
      qb.andWhere('program.startDate <= :toDate', { toDate });
    }

    return qb.getMany();
  }

  private withBooleanDefaults(data: any) {
    return {
      ...data,
      ...Object.fromEntries(
        BOOLEAN_FIELDS.map((field) => [field, Boolean(data?.[field])]),
      ),
    };
  }

  private stripUndefined(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  }

  private async ensurePeriodLog(userId: string, date: string) {
    const existing = await this.logs.findOne({ where: { userId, date } });
    if (existing) return existing;
    return this.logs.save(
      this.logs.create({
        userId,
        date,
        ...this.withBooleanDefaults({}),
      }),
    );
  }

  private async getProgram(userId: string, id: string) {
    const program = await this.programs.findOne({ where: { id, userId } });
    if (!program) throw new NotFoundException('Women program not found');
    return program;
  }

  private assertActiveProgram(program: WomenProgramCycleTypeormEntity) {
    if (program.status !== WomenProgramCycleStatus.ACTIVE) {
      throw new ConflictException('Women program is not active');
    }
  }

  private assertEndDateIsValid(
    program: WomenProgramCycleTypeormEntity,
    endDate: string,
  ) {
    if (endDate < program.startDate) {
      throw new BadRequestException('endDate must be on or after startDate');
    }
  }

  private assertDateBelongsToProgram(
    program: WomenProgramCycleTypeormEntity,
    date: string,
  ) {
    if (!isDateOnlyInRange(date, program.startDate, program.endDate)) {
      throw new BadRequestException(
        'date does not belong to this women program',
      );
    }
  }

  private getProgramDay(program: WomenProgramCycleTypeormEntity, date: string) {
    return diffDateOnlyInDays(date, program.startDate) + 1;
  }

  private toProgramResponse(
    program: WomenProgramCycleTypeormEntity,
    date?: string,
  ) {
    return {
      id: program.id,
      status: program.status,
      startDate: program.startDate,
      endDate: program.endDate ?? null,
      expectedDays: program.expectedDays,
      currentDay: date ? this.getProgramDay(program, date) : undefined,
    };
  }

  private async isPeriodMarked(userId: string, date: string) {
    return Boolean(await this.logs.findOne({ where: { userId, date } }));
  }

  private async getPeriodDateSet(userId: string, from: string, to: string) {
    const logs = await this.logs
      .createQueryBuilder('log')
      .where('log.userId = :userId', { userId })
      .andWhere('log.date >= :from', { from })
      .andWhere('log.date <= :to', { to })
      .getMany();
    return new Set(logs.map((log) => log.date));
  }

  private async countCompletedActivities(
    userId: string,
    programId: string,
    date: string,
  ) {
    return this.activities.count({
      where: { userId, programId, date, completed: true },
    });
  }

  private async getCompletedActivityCounts(
    userId: string,
    programId: string,
    from: string,
    to: string,
  ) {
    const rows = await this.activities
      .createQueryBuilder('activity')
      .select('activity.date', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.programId = :programId', { programId })
      .andWhere('activity.date >= :from', { from })
      .andWhere('activity.date <= :to', { to })
      .andWhere('activity.completed = true')
      .groupBy('activity.date')
      .getRawMany();

    return new Map(rows.map((row) => [row.date, Number(row.count)]));
  }

  private getDayStatus(activitiesCompleted: number) {
    if (activitiesCompleted >= WOMEN_PROGRAM_ACTIVITIES_TOTAL) {
      return WomenProgramDayStatus.DONE;
    }
    if (activitiesCompleted > 0) {
      return WomenProgramDayStatus.IN_PROGRESS;
    }
    return WomenProgramDayStatus.PENDING;
  }
}
