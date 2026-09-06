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

  /** FCM registration token for IOS and ANDROID, not a native APNs token. */
  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'enum', enum: DevicePlatform })
  platform: DevicePlatform;

  @Column({ type: 'varchar', length: 20, default: 'FCM' })
  provider: 'FCM';

  @Column({ type: 'varchar', length: 255, nullable: true })
  deviceId?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  appVersion?: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  lastSeenAt: Date;
}
