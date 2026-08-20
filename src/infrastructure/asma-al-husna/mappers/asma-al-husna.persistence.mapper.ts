import { AsmaAlHusnaModel } from '../../../domain/asma-al-husna/model/asma-al-husna.model';
import { AsmaAlHusnaNameTypeormEntity } from '../entities/asma-al-husna-name.typeorm-entity';

export class AsmaAlHusnaPersistenceMapper {
  static toDomain(entity: AsmaAlHusnaNameTypeormEntity): AsmaAlHusnaModel {
    return {
      ...entity,
      translations: [...(entity.translations ?? [])].sort((left, right) =>
        left.language.localeCompare(right.language),
      ),
    };
  }
}
