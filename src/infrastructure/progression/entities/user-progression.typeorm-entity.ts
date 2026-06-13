import { SpiritualLevel } from '../../../domain/progression/enums/spiritual-level.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_progression')
export class UserProgressionTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('uuid')
  userId: string;

  @Column({ default: 0 })
  totalHasanat: number;

  @Column({
    type: 'enum',
    enum: SpiritualLevel,
    default: SpiritualLevel.MURID,
  })
  currentVisibleLevel: SpiritualLevel;

  @Column({ default: 1 })
  currentHiddenSubLevel: number;

  @Column({ default: 0 })
  currentStreakDays: number;

  @Column({ default: 0 })
  longestStreakDays: number;

  @Column({ type: 'date', nullable: true })
  lastActivityDate?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
