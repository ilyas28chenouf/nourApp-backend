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
import { HadithCollectionTypeormEntity } from './hadith-collection.typeorm-entity';

@Entity('hadith_items')
@Unique('UQ_hadith_items_collection_number', ['collectionId', 'hadithNumber'])
@Index('IDX_hadith_items_collection_id', ['collectionId'])
@Index('IDX_hadith_items_hadith_number', ['hadithNumber'])
@Index('IDX_hadith_items_grade', ['grade'])
@Index('IDX_hadith_items_is_active', ['isActive'])
@Check('CHK_hadith_items_number_positive', '"hadithNumber" >= 1')
export class HadithItemTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  collectionId: string;

  @Column({
    type: 'integer',
  })
  hadithNumber: number;

  @Column({
    type: 'text',
  })
  arabic: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  english: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  french: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  grade: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  narrator: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  chapter: string | null;

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
    () => HadithCollectionTypeormEntity,
    (collection) => collection.items,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({
    name: 'collectionId',
  })
  collection: HadithCollectionTypeormEntity;
}
