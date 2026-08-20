import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AsmaAlHusnaNameTypeormEntity } from './asma-al-husna-name.typeorm-entity';

@Entity('asma_al_husna_translations')
@Unique('UQ_asma_al_husna_translation_language', ['nameId', 'language'])
@Check(
  'CHK_asma_al_husna_translation_language',
  `"language" IN ('ar', 'fr', 'en')`,
)
export class AsmaAlHusnaTranslationTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  nameId: string;

  @Column({ type: 'varchar', length: 5 })
  language: 'ar' | 'fr' | 'en';

  @Column({ type: 'varchar', length: 255 })
  translatedName: string;

  @Column({ type: 'text' })
  meaning: string;

  @Column({ type: 'text' })
  explanation: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sourceName?: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  sourceReference?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => AsmaAlHusnaNameTypeormEntity, (name) => name.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'nameId' })
  name: AsmaAlHusnaNameTypeormEntity;
}
