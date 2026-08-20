import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AsmaAlHusnaTranslationTypeormEntity } from './asma-al-husna-translation.typeorm-entity';

@Entity('asma_al_husna_names')
@Check('CHK_asma_al_husna_number', '"number" BETWEEN 1 AND 99')
export class AsmaAlHusnaNameTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'smallint' })
  number: number;

  @Column({ type: 'varchar', length: 255 })
  arabicName: string;

  @Column({ type: 'varchar', length: 255 })
  transliteration: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(
    () => AsmaAlHusnaTranslationTypeormEntity,
    (translation) => translation.name,
  )
  translations: AsmaAlHusnaTranslationTypeormEntity[];
}
