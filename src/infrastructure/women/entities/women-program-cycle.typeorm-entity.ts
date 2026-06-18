import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WomenProgramCycleStatus } from '../../../domain/women/enums/women-program-cycle-status.enum';

@Entity('women_program_cycles')
@Index(['userId'])
@Index(['userId', 'status'])
@Index(['userId'], { unique: true, where: `"status" = 'ACTIVE'` })
export class WomenProgramCycleTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date', nullable: true })
  endDate?: string | null;

  @Column({ type: 'integer', default: 8 })
  expectedDays!: number;

  @Column({
    type: 'enum',
    enum: WomenProgramCycleStatus,
    default: WomenProgramCycleStatus.ACTIVE,
  })
  status!: WomenProgramCycleStatus;

  @Column({ type: 'varchar', nullable: true })
  stopReason?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
