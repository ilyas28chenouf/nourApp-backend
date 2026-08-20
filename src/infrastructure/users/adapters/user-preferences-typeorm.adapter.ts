import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserPreferenceModel } from '../../../domain/users/model/user-preference.model';
import { UserPreferencesPersistencePort } from '../../../domain/users/ports/user-preferences-persistence.port';
import { UserPreferenceTypeormEntity } from '../entities/user-preference.typeorm-entity';

@Injectable()
export class UserPreferencesTypeormAdapter implements UserPreferencesPersistencePort {
  private readonly repository: Repository<UserPreferenceTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserPreferenceTypeormEntity);
  }
  findByUserId(userId: string) {
    return this.repository.findOne({
      where: { userId },
    }) as Promise<UserPreferenceModel | null>;
  }
  create(data: Partial<UserPreferenceModel>) {
    return this.repository.save(
      this.repository.create(data as any) as any,
    ) as any as Promise<UserPreferenceModel>;
  }
  async update(id: string, data: Partial<UserPreferenceModel>) {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Preferences not found');
    const updatePayload = Object.fromEntries(
      Object.entries(data)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [
          key,
          (key === 'dhikrPractices' || key === 'mainIntentions') &&
          Array.isArray(value)
            ? [...value]
            : value,
        ]),
    ) as Partial<UserPreferenceTypeormEntity>;
    await this.repository.update({ id }, updatePayload);
    return (await this.repository.findOne({
      where: { id },
    })) as UserPreferenceModel;
  }
}
