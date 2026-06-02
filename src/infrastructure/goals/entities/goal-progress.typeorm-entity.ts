import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('goal_progress')
@Index(['goalId', 'userId', 'progressDate'])
export class GoalProgressTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') goalId: string;
  @Column('uuid') userId: string;
  @Column({ type: 'date' }) progressDate: string;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  value: string;
  @Column({ default: false }) completed: boolean;
  @Column({ type: 'text', nullable: true }) notes?: string;
}
