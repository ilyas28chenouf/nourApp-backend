import { DevicePlatform } from '../../../domain/notifications/enums/device-platform.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('device_tokens')
@Index(['userId', 'token'], { unique: true })
export class DeviceTokenTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string;
  @Column() token: string;
  @Column({ type: 'enum', enum: DevicePlatform }) platform: DevicePlatform;
  @Column({ default: true }) isActive: boolean;
}
