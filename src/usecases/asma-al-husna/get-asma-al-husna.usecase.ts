import { NotFoundException } from '@nestjs/common';
import { AsmaAlHusnaPersistencePort } from '../../domain/asma-al-husna/ports/asma-al-husna-persistence.port';

export class GetAsmaAlHusnaUsecase {
  constructor(private readonly persistence: AsmaAlHusnaPersistencePort) {}

  list() {
    return this.persistence.findActive();
  }

  async get(number: number) {
    const name = await this.persistence.findActiveByNumber(number);
    if (!name) throw new NotFoundException('Name of Allah not found');
    return name;
  }
}
