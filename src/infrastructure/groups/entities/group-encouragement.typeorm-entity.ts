import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('group_encouragements')
export class GroupEncouragementTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column('uuid') groupId: string; @Column('uuid') senderUserId: string; @Column('uuid', { nullable: true }) receiverUserId?: string; @Column({ type: 'text' }) message: string;
}
