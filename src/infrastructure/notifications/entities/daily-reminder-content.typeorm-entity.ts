import { DailyReminderContentType } from '../../../domain/notifications/enums/daily-reminder-content-type.enum';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('daily_reminder_contents')
@Index(['cycleDay'], { unique: true })
@Check('"cycleDay" >= 1 AND "cycleDay" <= 120')
export class DailyReminderContentTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'integer' })
  cycleDay: number;

  @Column({ type: 'enum', enum: DailyReminderContentType })
  type: DailyReminderContentType;

  @Column({ type: 'text', nullable: true })
  arabicText?: string | null;

  @Column({ type: 'text' })
  frenchText: string;

  @Column()
  source: string;

  @Column({ default: true })
  isActive: boolean;
}
