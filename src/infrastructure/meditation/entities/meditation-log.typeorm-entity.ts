import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('meditation_logs') @Index(['userId', 'sessionDate'])
export class MeditationLogTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string; @Column({ type: 'date' }) sessionDate: string; @Column() durationMinutes: number; @Column({ nullable: true }) concentrationLevel?: number; @Column({ type: 'text', nullable: true }) notes?: string;
}
