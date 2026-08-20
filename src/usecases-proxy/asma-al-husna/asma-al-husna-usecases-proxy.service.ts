import { Injectable } from '@nestjs/common';
import { AsmaAlHusnaTypeormAdapter } from '../../infrastructure/asma-al-husna/adapters/asma-al-husna-typeorm.adapter';
import { GetAsmaAlHusnaUsecase } from '../../usecases/asma-al-husna/get-asma-al-husna.usecase';

@Injectable()
export class AsmaAlHusnaUsecasesProxyService {
  private readonly getAsma: GetAsmaAlHusnaUsecase;

  constructor(persistence: AsmaAlHusnaTypeormAdapter) {
    this.getAsma = new GetAsmaAlHusnaUsecase(persistence);
  }

  list() {
    return this.getAsma.list();
  }

  get(number: number) {
    return this.getAsma.get(number);
  }
}
