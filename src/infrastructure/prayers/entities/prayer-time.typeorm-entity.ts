import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('prayer_times') @Index(['userId', 'prayerDate'])
export class PrayerTimeTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column('uuid') userId: string; @Column({ type: 'date' }) prayerDate: string; @Column({ type: 'timestamptz' }) fajrTime: Date; @Column({ type: 'timestamptz' }) dhuhrTime: Date; @Column({ type: 'timestamptz' }) asrTime: Date; @Column({ type: 'timestamptz' }) maghribTime: Date; @Column({ type: 'timestamptz' }) ishaTime: Date; @Column() source: string; @Column({ nullable: true }) city?: string; @Column({ nullable: true }) country?: string; @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) latitude?: string; @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) longitude?: string;
}
