import { Injectable } from '@nestjs/common';
import { DhikrTypeormAdapter } from '../../infrastructure/dhikr/adapters/dhikr-typeorm.adapter';
import { CreateDhikrLogUsecase } from '../../usecases/dhikr/create-dhikr-log.usecase';
import { GetDhikrItemsUsecase } from '../../usecases/dhikr/get-dhikr-items.usecase';
import { GetDhikrLogsUsecase } from '../../usecases/dhikr/get-dhikr-logs.usecase';
import { UpdateDhikrLogUsecase } from '../../usecases/dhikr/update-dhikr-log.usecase';
import { ProgressionService } from '../progression/progression.service';

@Injectable()
export class DhikrUsecasesProxyService {
  constructor(
    private readonly dhikr: DhikrTypeormAdapter,
    private readonly progression: ProgressionService,
  ) {}

  items(filters?: any) {
    return this.dhikr.findItems(filters);
  }
  categories() {
    return this.dhikr.findCategories();
  }
  itemsByCategorySlug(slug: string) {
    return this.dhikr.findItemsByCategorySlug(slug);
  }
  createCategory(data: any) {
    return this.dhikr.createCategory(data);
  }
  updateCategory(id: string, data: any) {
    return this.dhikr.updateCategory(id, data);
  }
  deleteCategory(id: string) {
    return this.dhikr.deleteCategory(id);
  }
  createItem(data: any) {
    return this.dhikr.createItem(data);
  }
  updateItem(id: string, data: any) {
    return this.dhikr.updateItem(id, data);
  }
  deleteItem(id: string) {
    return this.dhikr.deleteItem(id);
  }
  logs(userId: string, date?: string) {
    return new GetDhikrLogsUsecase(this.dhikr).execute(userId, date);
  }
  async createLog(userId: string, data: any) {
    const log = await new CreateDhikrLogUsecase(this.dhikr).execute(
      userId,
      data,
    );
    await this.progression.recordDhikrLog(log);
    return log;
  }
  async updateLog(userId: string, id: string, data: any) {
    const log = await new UpdateDhikrLogUsecase(this.dhikr).execute(
      userId,
      id,
      data,
    );
    await this.progression.recordDhikrLog(log);
    return log;
  }
}
