import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CharityActionType } from '../../../domain/charity/enums/charity-action-type.enum';
@Entity('charity_logs')
@Index(['userId', 'charityDate'])
export class CharityLogTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string;
  @Column({ type: 'date' }) charityDate: string;
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  amount?: string;
  @Column({ default: 'EUR' }) currency: string;
  @Column({ nullable: true }) frequencyType?: string;
  @Column({
    type: 'enum',
    enum: CharityActionType,
    default: CharityActionType.SADAQA,
  })
  actionType: CharityActionType;
  @Column({ type: 'text', nullable: true }) description?: string;
}
