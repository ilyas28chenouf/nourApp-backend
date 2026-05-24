import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('users')
export class UserTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Index({ unique: true }) @Column() firebaseUid: string;
  @Index({ unique: true, where: '"email" IS NOT NULL' }) @Column({ nullable: true }) email?: string;
  @Column({ nullable: true }) phone?: string; @Column({ nullable: true }) fullName?: string; @Column({ nullable: true }) avatarUrl?: string; @Column({ nullable: true }) provider?: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER }) role: UserRole;
  @Column({ default: 'fr' }) language: string; @Column({ nullable: true }) timezone?: string; @Column({ nullable: true }) city?: string; @Column({ nullable: true }) country?: string;
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) latitude?: string; @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) longitude?: string;
  @Column({ default: true }) isActive: boolean; @Column({ type: 'timestamptz', nullable: true }) lastLoginAt?: Date;
}
