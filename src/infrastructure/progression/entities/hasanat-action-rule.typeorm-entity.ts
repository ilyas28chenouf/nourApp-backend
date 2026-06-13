import { HasanatSourceType } from '../../../domain/progression/enums/hasanat-source-type.enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('hasanat_action_rules')
export class HasanatActionRuleTypeormEntity {
  @PrimaryColumn()
  key: string;

  @Column({ type: 'enum', enum: HasanatSourceType })
  sourceType: HasanatSourceType;

  @Column()
  points: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: true })
  isActive: boolean;
}
