import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TafsirCollectionTypeormEntity } from './tafsir-collection.typeorm-entity';

@Entity('tafsir_progress')
@Index(['userId', 'readDate'])
@Index(['collectionId', 'surahNumber', 'ayahNumber'])
@Index(
  'IDX_tafsir_progress_daily_evidence',
  ['userId', 'collectionId', 'surahNumber', 'ayahNumber', 'readDate'],
  { unique: true },
)
export class TafsirProgressTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  collectionId: string;

  @Column({ type: 'integer' })
  surahNumber: number;

  @Column({ type: 'integer' })
  ayahNumber: number;

  @Column({ type: 'date' })
  readDate: string;

  @Column({ default: true })
  completed: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => TafsirCollectionTypeormEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'collectionId' })
  collection: TafsirCollectionTypeormEntity;
}
