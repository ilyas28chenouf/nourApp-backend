import { FastingType } from '../../../domain/fasting/enums/fasting-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('fasting_recommended_days')
export class FastingRecommendedDayTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Index() @Column({ type: 'date' }) date: string;
  @Column({ nullable: true }) hijriDate?: string;
  @Column({ type: 'enum', enum: FastingType }) type: FastingType;
  @Column() title: string;
  @Column({ type: 'text', nullable: true }) description?: string;
}
