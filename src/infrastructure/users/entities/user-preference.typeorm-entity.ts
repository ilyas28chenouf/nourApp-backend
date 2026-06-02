import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('user_preferences')
export class UserPreferenceTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Index({ unique: true }) @Column('uuid') userId: string;
  @Column({ default: 'default' }) theme: string;
  @Column({ default: 'fr' }) language: string;
  @Column({ default: true }) prayerNotificationsEnabled: boolean;
  @Column({ default: true }) fastingNotificationsEnabled: boolean;
  @Column({ default: true }) dhikrNotificationsEnabled: boolean;
  @Column({ default: true }) quranNotificationsEnabled: boolean;
  @Column({ default: true }) encouragementNotificationsEnabled: boolean;
  @Column({ default: 'Algeria' }) prayerCalculationMethod: string;
  @Column({ default: 'Shafi' }) prayerMadhab: string;
}
