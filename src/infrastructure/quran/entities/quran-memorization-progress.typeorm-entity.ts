import { QuranMemorizationStatus } from '../../../domain/quran/enums/quran-memorization-status.enum';
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

  @Column({
    type: 'enum',
    enum: QuranMemorizationStatus,
    default: QuranMemorizationStatus.NOT_STARTED,
  })
  status: QuranMemorizationStatus;

  @Column({ type: 'timestamptz', nullable: true })
  lastReviewedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
