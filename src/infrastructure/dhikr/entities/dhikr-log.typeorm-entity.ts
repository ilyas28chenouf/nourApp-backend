import { DhikrPeriod } from '../../../domain/dhikr/enums/dhikr-period.enum';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('dhikr_logs') @Index(['userId', 'dhikrDate'])
export class DhikrLogTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string; @Column({ type: 'date' }) dhikrDate: string; @Column({ type: 'enum', enum: DhikrPeriod }) period: DhikrPeriod; @Column({ default: 0 }) counter: number; @Column({ default: false }) completed: boolean; @Column({ type: 'timestamptz', nullable: true }) completedAt?: Date; @Column({ type: 'text', nullable: true }) notes?: string;
}
