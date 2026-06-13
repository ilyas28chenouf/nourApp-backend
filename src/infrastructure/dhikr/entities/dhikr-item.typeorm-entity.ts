import { DhikrCategory } from '../../../domain/dhikr/enums/dhikr-category.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('dhikr_items')
export class DhikrItemTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column() title: string;
  @Column({ type: 'text' }) arabicText: string;
  @Column({ type: 'text', nullable: true }) translation?: string;
  @Column({ type: 'text', nullable: true }) transliteration?: string;
  @Column({ type: 'uuid', nullable: true })
  categoryId?: string | null;
  @Column({ type: 'enum', enum: DhikrCategory }) category: DhikrCategory;
  @Column({ nullable: true }) sourceName?: string;
  @Column({ nullable: true }) sourceReference?: string;
  @Column({ default: 1 }) recommendedCount: number;
  @Column({ default: 0 }) sortOrder: number;
  @Column({ default: true }) isActive: boolean;
}
