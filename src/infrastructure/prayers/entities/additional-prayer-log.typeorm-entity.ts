import { AdditionalPrayerTime } from '../../../domain/prayers/enums/additional-prayer-time.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('additional_prayer_logs')
@Index(['userId', 'prayerDate', 'prayerTime'])
export class AdditionalPrayerLogTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column({ type: 'date' })
  prayerDate!: string;

  @Column({
    type: 'enum',
    enum: AdditionalPrayerTime,
    enumName: 'additional_prayer_time',
  })
  prayerTime!: AdditionalPrayerTime;

  @Column({ type: 'integer' })
  rakaat!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
