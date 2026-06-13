import { SisterUnavailableDayType } from '../../../domain/sisters/enums/sister-unavailable-day-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sister_unavailable_days')
@Index(['userId', 'date'], { unique: true })
export class SisterUnavailableDayTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: SisterUnavailableDayType })
  type: SisterUnavailableDayType;

  @Column({ type: 'text', nullable: true })
  encryptedMetadata?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
