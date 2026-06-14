import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('women_period_logs')
@Index(['userId', 'date'])
export class WomenPeriodLogTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  feeling?: string | null;

  @Column({ type: 'boolean', default: false })
  quran!: boolean;

  @Column({ type: 'boolean', default: false })
  dhikr!: boolean;

  @Column({ type: 'boolean', default: false })
  doua!: boolean;

  @Column({ type: 'boolean', default: false })
  reading!: boolean;

  @Column({ type: 'boolean', default: false })
  sadaka!: boolean;

  @Column({ type: 'boolean', default: false })
  meditation!: boolean;

  @Column({ type: 'boolean', default: false })
  hadith!: boolean;

  @Column({ type: 'boolean', default: false })
  health!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
