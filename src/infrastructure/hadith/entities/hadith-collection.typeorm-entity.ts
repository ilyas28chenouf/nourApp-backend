import {
  Column,
  Check,
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
  @Column()
  key: string;

  @Column()
  name: string;

  @Column()
  arabicName: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  reliability?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ nullable: true })
  sourceName?: string | null;

  @Column({ nullable: true })
  sourceUrl?: string | null;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => HadithItemTypeormEntity, (item) => item.collection)
  items?: HadithItemTypeormEntity[];

  totalHadiths?: number;
}
