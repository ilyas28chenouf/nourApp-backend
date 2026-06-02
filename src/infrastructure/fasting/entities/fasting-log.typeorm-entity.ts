import { FastingStatus } from '../../../domain/fasting/enums/fasting-status.enum';
import { FastingType } from '../../../domain/fasting/enums/fasting-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('fasting_logs')
@Index(['userId', 'fastingDate'])
export class FastingLogTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string;
  @Column({ type: 'date' }) fastingDate: string;
  @Column({ type: 'enum', enum: FastingType }) fastingType: FastingType;
  @Column({ type: 'enum', enum: FastingStatus }) status: FastingStatus;
  @Column({ type: 'text', nullable: true }) notes?: string;
}
