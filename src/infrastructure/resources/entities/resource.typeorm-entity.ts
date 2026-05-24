import { ResourceType } from '../../../domain/resources/enums/resource-type.enum';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('resources')
export class ResourceTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column() title: string; @Column({ type: 'enum', enum: ResourceType }) type: ResourceType; @Column({ type: 'text', nullable: true }) content?: string; @Column({ nullable: true }) audioUrl?: string; @Column({ nullable: true }) imageUrl?: string; @Column({ default: 'fr' }) language: string; @Column({ nullable: true }) category?: string; @Column({ nullable: true }) sourceName?: string; @Column({ nullable: true }) sourceUrl?: string; @Column({ default: true }) isActive: boolean; @Column('uuid', { nullable: true }) createdBy?: string;
}
