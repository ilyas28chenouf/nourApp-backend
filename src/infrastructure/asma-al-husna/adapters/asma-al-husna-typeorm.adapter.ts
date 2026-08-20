import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AsmaAlHusnaPersistencePort } from '../../../domain/asma-al-husna/ports/asma-al-husna-persistence.port';
import { AsmaAlHusnaNameTypeormEntity } from '../entities/asma-al-husna-name.typeorm-entity';
import { AsmaAlHusnaPersistenceMapper } from '../mappers/asma-al-husna.persistence.mapper';

@Injectable()
export class AsmaAlHusnaTypeormAdapter implements AsmaAlHusnaPersistencePort {
  private readonly names: Repository<AsmaAlHusnaNameTypeormEntity>;

  constructor(dataSource: DataSource) {
    this.names = dataSource.getRepository(AsmaAlHusnaNameTypeormEntity);
  }

  async findActive() {
    const entities = await this.names.find({
      where: { isActive: true },
      relations: { translations: true },
      order: { sortOrder: 'ASC', number: 'ASC' },
    });
    return entities.map((entity) =>
      AsmaAlHusnaPersistenceMapper.toDomain(entity),
    );
  }

  async findActiveByNumber(number: number) {
    const entity = await this.names.findOne({
      where: { number, isActive: true },
      relations: { translations: true },
    });
    return entity ? AsmaAlHusnaPersistenceMapper.toDomain(entity) : null;
  }
}
