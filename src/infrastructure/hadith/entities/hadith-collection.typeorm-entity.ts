import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HadithItemTypeormEntity } from './hadith-item.typeorm-entity';

@Entity('hadith_collections')
@Check('CHK_hadith_collections_key_slug', `"key" ~ '^[a-z0-9-]+$'`)
export class HadithCollectionTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('UQ_hadith_collections_key', { unique: true })
  @Column({
    type: 'varchar',
    length: 100,
  })
  key: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  arabicName: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  author: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  reliability: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  sourceName: string | null;

  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  sourceUrl: string | null;

  @Column({
    type: 'integer',
    default: 0,
  })
  sortOrder: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'published',
    type: 'boolean',
    default: true,
  })
  published: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @OneToMany(() => HadithItemTypeormEntity, (item) => item.collection)
  items: HadithItemTypeormEntity[];

  totalHadiths?: number;
}
