import { NotificationStatus } from '../../../domain/notifications/enums/notification-status.enum';
import { NotificationType } from '../../../domain/notifications/enums/notification-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('scheduled_notifications')
@Index(['userId'])
@Index(['status'])
@Index(['scheduledAt'])
@Index(['dedupeKey'], { unique: true, where: '"dedupeKey" IS NOT NULL' })
export class ScheduledNotificationTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') userId: string;
  @Column({ type: 'enum', enum: NotificationType }) type: NotificationType;
  @Column({ type: 'varchar', length: 255 }) title: string;
  @Column({ type: 'text' }) body: string;
  @Column({ type: 'timestamptz' }) scheduledAt: Date;
  @Column({ type: 'timestamptz', nullable: true }) sentAt?: Date | null;
  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column('uuid', { nullable: true })
  contentId?: string | null;

@Column({ type: 'varchar', length: 255, nullable: true })
fcmMessageId?: string | null;

  @Column({ type: 'text', nullable: true })
  failureReason?: string | null;

  @Column({ type: 'jsonb', nullable: true }) metadata?: Record<string, unknown>;

@Column({ type: 'varchar', length: 255, nullable: true })
dedupeKey?: string | null;
}
