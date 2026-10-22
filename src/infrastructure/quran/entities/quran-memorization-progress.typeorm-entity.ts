import { QuranMemorizationStatus } from '../../../domain/quran/enums/quran-memorization-status.enum';
import { QuranMemorizationUnit } from '../../../domain/quran/enums/quran-memorization-unit.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('quran_memorization_progress')
@Index(['userId', 'surahNumber'])
@Index('IDX_quran_memorization_user_date', ['userId', 'memorizationDate'], {
  unique: true,
})
export class QuranMemorizationProgressTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  surahNumber: number;

  @Column({ nullable: true })
  ayahFrom?: number;

  @Column({ nullable: true })
  ayahTo?: number;

  @Column({ type: 'date', nullable: true })
  memorizationDate?: string;

  @Column({ type: 'enum', enum: QuranMemorizationUnit, nullable: true })
  selectionUnit?: QuranMemorizationUnit;

  @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  selectionValue?: string;

  @Column({
    type: 'enum',
    enum: QuranMemorizationStatus,
    default: QuranMemorizationStatus.NOT_STARTED,
  })
  status: QuranMemorizationStatus;

  @Column({ type: 'timestamptz', nullable: true })
  lastReviewedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
