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
import { TafsirItemTypeormEntity } from './tafsir-item.typeorm-entity';

@Entity('tafsir_collections')
@Check('CHK_tafsir_collections_key_slug', `"key" ~ '^[a-z0-9-]+$'`)
export class TafsirCollectionTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('UQ_tafsir_collections_key', { unique: true })
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
    nullable: true,
  })
  arabicName: string | null;

  @Column({
    type: 'varchar',
    length: 255,
  })
  author: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  language: string;

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

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @OneToMany(() => TafsirItemTypeormEntity, (item) => item.collection)
  items: TafsirItemTypeormEntity[];

  totalTafsirs?: number;
}
