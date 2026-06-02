import { LearningItemType } from '../../../domain/learning/enums/learning-item-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('learning_items')
export class LearningItemTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column() title: string;
  @Column({ type: 'enum', enum: LearningItemType }) type: LearningItemType;
  @Column({ type: 'text' }) content: string;
  @Column({ type: 'text', nullable: true }) explanation?: string;
  @Column({ nullable: true }) audioUrl?: string;
  @Column({ nullable: true }) difficulty?: string;
  @Column({ default: 'fr' }) language: string;
  @Column({ default: true }) isActive: boolean;
}
