import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UsersPersistencePort } from '../../../domain/users/ports/users-persistence.port';
import type { UserModel } from '../../../domain/users/model/user.model';
import { UserTypeormEntity } from '../entities/user.typeorm-entity';

@Injectable()
export class UsersTypeormAdapter implements UsersPersistencePort {
  private readonly repository: Repository<UserTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserTypeormEntity);
  }
  findById(id: string) {
    return this.repository.findOne({
      where: { id },
    }) as Promise<UserModel | null>;
  }
  findByFirebaseUid(firebaseUid: string) {
    return this.repository.findOne({
      where: { firebaseUid },
    }) as Promise<UserModel | null>;
  }
  findByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
    }) as Promise<UserModel | null>;
  }
  findAll() {
    return this.repository.find({ order: { createdAt: 'DESC' } }) as Promise<
      UserModel[]
    >;
  }
  create(data: Partial<UserModel>) {
    return this.repository.save(
      this.repository.create(data as any) as any,
    ) as any as Promise<UserModel>;
  }
  async update(id: string, data: Partial<UserModel>) {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');
    const updatePayload = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<UserTypeormEntity>;
    await this.repository.update({ id }, updatePayload);
    return (await this.repository.findOne({ where: { id } })) as UserModel;
  }
  async save(user: UserModel) {
    await this.repository.save(user as any);
    return (await this.repository.findOne({
      where: { id: user.id },
    })) as UserModel;
  }
}
