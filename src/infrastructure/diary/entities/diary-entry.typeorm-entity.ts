import { DiaryEntryType } from '../../../domain/diary/enums/diary-entry-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('diary_entries')
@Index(['userId', 'entryDate'])
@Index(['userId', 'type'])
export class DiaryEntryTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column({ type: 'date' })
  entryDate!: string;

  @Column({
    type: 'enum',
    enum: DiaryEntryType,
    enumName: 'diary_entry_type',
  })
  type!: DiaryEntryType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  feeling?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string | null;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  tags!: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
