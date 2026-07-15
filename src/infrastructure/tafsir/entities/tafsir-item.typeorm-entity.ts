import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { TafsirCollectionTypeormEntity } from './tafsir-collection.typeorm-entity';

@Entity('tafsir_items')
@Unique('UQ_tafsir_items_collection_surah_ayah', [
  'collectionId',
  'surahNumber',
  'ayahNumber',
])
@Index('IDX_tafsir_items_collection_id', ['collectionId'])
@Index('IDX_tafsir_items_surah_number', ['surahNumber'])
@Index('IDX_tafsir_items_ayah_number', ['ayahNumber'])
@Index('IDX_tafsir_items_is_active', ['isActive'])
@Check('CHK_tafsir_items_surah_range', '"surahNumber" BETWEEN 1 AND 114')
@Check('CHK_tafsir_items_ayah_positive', '"ayahNumber" >= 1')
export class TafsirItemTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  collectionId: string;

  @Column({
    type: 'integer',
  })
  surahNumber: number;

  @Column({
    type: 'integer',
  })
  ayahNumber: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  surahName: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  title: string | null;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  sourceReference: string | null;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @ManyToOne(
    () => TafsirCollectionTypeormEntity,
    (collection) => collection.items,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({
    name: 'collectionId',
  })
  collection: TafsirCollectionTypeormEntity;
}
