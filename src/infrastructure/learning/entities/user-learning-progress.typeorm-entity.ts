import { LearningProgressStatus } from '../../../domain/learning/enums/learning-progress-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('user_learning_progress')
@Index(['userId', 'learningItemId'], { unique: true })
export class UserLearningProgressTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string;
  @Column('uuid') learningItemId: string;
  @Column({ type: 'enum', enum: LearningProgressStatus })
  status: LearningProgressStatus;
  @Column({ default: 0 }) progressPercent: number;
  @Column({ type: 'timestamptz', nullable: true }) lastReviewedAt?: Date;
}
