import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WomenProgramActivityKey } from '../../../domain/women/enums/women-program-activity-key.enum';

@Entity('women_program_activity_logs')
@Index(['userId', 'programId', 'date', 'activityKey'], { unique: true })
@Index(['userId', 'programId', 'date'])
export class WomenProgramActivityLogTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  programId!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'integer' })
  programDay!: number;

  @Column({ type: 'enum', enum: WomenProgramActivityKey })
  activityKey!: WomenProgramActivityKey;

  @Column({ type: 'boolean', default: false })
  completed!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt?: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
