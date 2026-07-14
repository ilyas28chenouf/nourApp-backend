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
import { TafsirItemTypeormEntity } from './tafsir-item.typeorm-entity';

@Entity('tafsir_collections')
@Check('CHK_tafsir_collections_key_slug', `"key" ~ '^[a-z0-9-]+$'`)
export class TafsirCollectionTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('UQ_tafsir_collections_key', { unique: true })
  @Column()
  key: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  arabicName?: string | null;

  @Column()
  author: string;

  @Column()
  language: string;

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

  @OneToMany(() => TafsirItemTypeormEntity, (item) => item.collection)
  items?: TafsirItemTypeormEntity[];

  totalTafsirs?: number;
}
