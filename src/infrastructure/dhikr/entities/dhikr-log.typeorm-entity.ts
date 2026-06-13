import { DhikrPeriod } from '../../../domain/dhikr/enums/dhikr-period.enum';
import { DhikrSessionType } from '../../../domain/dhikr/enums/dhikr-session-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('dhikr_logs')
@Index(['userId', 'dhikrDate'])
export class DhikrLogTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string;
  @Column({ type: 'date' }) dhikrDate: string;
  @Column({ type: 'enum', enum: DhikrPeriod }) period: DhikrPeriod;
  @Column({ type: 'uuid', nullable: true })
  dhikrItemId: string | null;
  @Column({ type: 'uuid', nullable: true })
  categoryId: string | null;
  @Column({ type: 'enum', enum: DhikrSessionType, nullable: true })
  sessionType: DhikrSessionType | null;
  @Column({ default: 0 }) counter: number;
  @Column({ default: false }) completed: boolean;
  @Column({ type: 'timestamptz', nullable: true }) completedAt: Date | null;
  @Column({ type: 'text', nullable: true }) notes: string | null;
}
