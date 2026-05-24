import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('groups')
export class GroupTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column() name: string; @Column({ type: 'text', nullable: true }) description?: string; @Column('uuid') ownerUserId: string; @Index({ unique: true }) @Column() inviteCode: string; @Column({ default: true }) isActive: boolean;
}
