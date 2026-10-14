import { SpiritualLevel } from '../../../domain/progression/enums/spiritual-level.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { numericColumnTransformer } from '../../database/numeric-column.transformer';

@Entity('user_progression')
export class UserProgressionTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('uuid')
  userId: string;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 1,
    default: 0,
    transformer: numericColumnTransformer,
  })
  totalHasanat: number;

  @Column({
    type: 'varchar',
    length: 100,
    default: SpiritualLevel.EVEIL_SERVITEUR_D_ALLAH,
  })
  currentVisibleLevel: SpiritualLevel;

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
