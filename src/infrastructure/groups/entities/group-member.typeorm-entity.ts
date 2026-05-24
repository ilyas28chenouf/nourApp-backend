import { GroupMemberRole } from '../../../domain/groups/enums/group-member-role.enum'; import { GroupMemberStatus } from '../../../domain/groups/enums/group-member-status.enum';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('group_members') @Index(['groupId', 'userId'], { unique: true })
export class GroupMemberTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('uuid') groupId: string; @Column('uuid') userId: string; @Column({ type: 'enum', enum: GroupMemberRole }) role: GroupMemberRole; @Column({ type: 'enum', enum: GroupMemberStatus }) status: GroupMemberStatus; @Column({ type: 'timestamptz', nullable: true }) joinedAt?: Date;
}
