import { BadgeKey } from '../../../domain/progression/enums/badge-key.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_badges')
@Index(['userId', 'badgeKey'], { unique: true })
export class UserBadgeTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'enum', enum: BadgeKey })
  badgeKey: BadgeKey;

  @CreateDateColumn({ type: 'timestamptz' })
  unlockedAt: Date;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata: Record<string, unknown>;
}
