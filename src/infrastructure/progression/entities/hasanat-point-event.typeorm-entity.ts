import { HasanatSourceType } from '../../../domain/progression/enums/hasanat-source-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('hasanat_point_events')
@Index(['userId', 'eventDate'])
@Index(['userId', 'sourceType', 'sourceId', 'actionKey'], { unique: true })
export class HasanatPointEventTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'enum', enum: HasanatSourceType })
  sourceType: HasanatSourceType;

  @Column({ type: 'uuid', nullable: true })
  sourceId?: string | null;

  @Column()
  actionKey: string;

  @Column()
  points: number;

  @Column({ type: 'date' })
  eventDate: string;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
