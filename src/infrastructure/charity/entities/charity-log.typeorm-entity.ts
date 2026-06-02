import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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
  @Column({ type: 'text', nullable: true }) description?: string;
}
