import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('prayer_times')
@Index(['userId', 'prayerDate', 'calculationMethod', 'madhab', 'timezone'])
export class PrayerTimeTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string;
  @Column({ type: 'date' }) prayerDate: string;
  @Column() timezone: string;
  @Column({ nullable: true }) city?: string;
  @Column({ nullable: true }) country?: string;
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: string;
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: string;
  @Column() calculationMethod: string;
  @Column() madhab: string;
  @Column({ nullable: true }) imsak?: string;
  @Column() fajr: string;
  @Column({ nullable: true }) sunrise?: string;
  @Column() dhuhr: string;
  @Column() asr: string;
  @Column() maghrib: string;
  @Column() isha: string;
  @Column({ nullable: true }) imsakDateTime?: string;
  @Column({ nullable: true }) fajrDateTime?: string;
  @Column({ nullable: true }) sunriseDateTime?: string;
  @Column({ nullable: true }) dhuhrDateTime?: string;
  @Column({ nullable: true }) asrDateTime?: string;
  @Column({ nullable: true }) maghribDateTime?: string;
  @Column({ nullable: true }) ishaDateTime?: string;
  @Column({ nullable: true }) currentPrayer?: string;
  @Column({ nullable: true }) nextPrayer?: string;
  @Column({ nullable: true }) timeUntilNext?: string;
  @Column({ type: 'int', nullable: true }) minutesUntilNext?: number;
  @Column({ default: 'UMMAH_API' }) source: string;
  @Column({ type: 'jsonb', nullable: true })
  rawResponse?: Record<string, unknown>;
}
