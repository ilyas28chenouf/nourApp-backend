import { GoalFrequency } from '../../../domain/goals/enums/goal-frequency.enum'; import { GoalType } from '../../../domain/goals/enums/goal-type.enum';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('goals')
export class GoalTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid', { nullable: true }) ownerUserId?: string; @Column('uuid', { nullable: true }) groupId?: string; @Column() title: string; @Column({ type: 'text', nullable: true }) description?: string; @Column({ type: 'enum', enum: GoalType }) goalType: GoalType; @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true }) targetValue?: string; @Column({ nullable: true }) targetUnit?: string; @Column({ type: 'enum', enum: GoalFrequency }) frequency: GoalFrequency; @Column({ type: 'date' }) startDate: string; @Column({ type: 'date', nullable: true }) endDate?: string; @Column({ default: false }) isGroupGoal: boolean; @Column({ default: true }) isActive: boolean;
}
