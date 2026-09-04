import { PrayerMode } from '../../../domain/prayers/enums/prayer-mode.enum';
import { PrayerName } from '../../../domain/prayers/enums/prayer-name.enum';
import { PrayerStatus } from '../../../domain/prayers/enums/prayer-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('prayer_logs')
@Index(['userId', 'prayerDate'])
export class PrayerLogTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string;
  @Column({ type: 'date' }) prayerDate: string;
  @Column({ type: 'enum', enum: PrayerName }) prayerName: PrayerName;
  @Column({ type: 'enum', enum: PrayerStatus }) status: PrayerStatus;
  @Column({ type: 'timestamptz', nullable: true }) prayedAt: Date | null;
  @Column({ default: false }) wasOnTime: boolean;
  @Column({ type: 'enum', enum: PrayerMode, nullable: true })
  prayerMode: PrayerMode | null;
  @Column({ default: false }) isSupererogatory: boolean;
  @Column({ type: 'integer', nullable: true }) rakaat: number | null;
  @Column({ default: false }) prayedAtMosque: boolean;
  @Column({ type: 'text', nullable: true }) notes: string | null;
}
