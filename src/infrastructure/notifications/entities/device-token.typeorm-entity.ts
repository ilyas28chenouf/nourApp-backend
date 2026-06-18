import { DevicePlatform } from '../../../domain/notifications/enums/device-platform.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('notification_device_tokens')
@Index(['userId'])
@Index(['token'], { unique: true })
@Index(['isActive'])
export class DeviceTokenTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid')
  userId: string;

  @Column()
  token: string;

  @Column({ type: 'enum', enum: DevicePlatform }) platform: DevicePlatform;

  @Column({ default: 'FCM' })
  provider: 'FCM';

  @Column({ nullable: true })
  deviceId?: string | null;

  @Column({ nullable: true })
  appVersion?: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  lastSeenAt: Date;
}
