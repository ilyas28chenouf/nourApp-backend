import { NotificationStatus } from '../../../domain/notifications/enums/notification-status.enum'; import { NotificationType } from '../../../domain/notifications/enums/notification-type.enum';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('scheduled_notifications') @Index(['userId', 'scheduledAt'])
export class ScheduledNotificationTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string; @Column({ type: 'enum', enum: NotificationType }) type: NotificationType; @Column() title: string; @Column({ type: 'text' }) body: string; @Column({ type: 'timestamptz' }) scheduledAt: Date; @Column({ type: 'timestamptz', nullable: true }) sentAt?: Date; @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING }) status: NotificationStatus; @Column({ type: 'jsonb', nullable: true }) metadata?: Record<string, unknown>;
}
