import { GoalFrequency } from '../../../domain/goals/enums/goal-frequency.enum'; import { QuranGoalType } from '../../../domain/quran/enums/quran-goal-type.enum';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('quran_reading_goals')
export class QuranReadingGoalTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Index() @Column('uuid') userId: string; @Column() title: string; @Column({ type: 'enum', enum: QuranGoalType }) goalType: QuranGoalType; @Column({ nullable: true }) targetPages?: number; @Column({ nullable: true }) targetSurah?: string; @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true }) targetHizb?: string; @Column({ type: 'enum', enum: GoalFrequency }) frequency: GoalFrequency; @Column({ default: true }) isActive: boolean;
}
