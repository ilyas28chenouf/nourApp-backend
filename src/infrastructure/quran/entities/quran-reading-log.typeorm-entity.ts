import { ReadingPeriod } from '../../../domain/quran/enums/reading-period.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('quran_reading_logs')
@Index(['userId', 'readingDate'])
export class QuranReadingLogTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string;
  @Column({ type: 'date' }) readingDate: string;
  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  pagesCount: number;
  @Column({ nullable: true }) surahName?: string;
  @Column({ nullable: true }) surahNumber?: number;
  @Column({ nullable: true }) ayahFrom?: number;
  @Column({ nullable: true }) ayahTo?: number;
  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  hizbCount: string;
  @Column({ type: 'enum', enum: ReadingPeriod, nullable: true })
  readingPeriod?: ReadingPeriod;
  @Column({ default: false }) objectiveReached: boolean;
  @Column({ type: 'text', nullable: true }) notes?: string;
}
