import { Injectable } from '@nestjs/common';
import { ResourcesTypeormAdapter } from '../../infrastructure/resources/adapters/resources-typeorm.adapter';
import { CreateResourceUsecase } from '../../usecases/resources/create-resource.usecase';
import { DeleteResourceUsecase } from '../../usecases/resources/delete-resource.usecase';
import { GetResourceByIdUsecase } from '../../usecases/resources/get-resource-by-id.usecase';
import { GetResourcesUsecase } from '../../usecases/resources/get-resources.usecase';
import { UpdateResourceUsecase } from '../../usecases/resources/update-resource.usecase';

@Injectable()
export class ResourcesUsecasesProxyService {
  constructor(private readonly resources: ResourcesTypeormAdapter) {}

  list() {
    return new GetResourcesUsecase(this.resources).execute();
  }
  get(id: string) {
    return new GetResourceByIdUsecase(this.resources).execute(id);
  }
  create(createdBy: string, data: any) {
    return new CreateResourceUsecase(this.resources).execute(createdBy, data);
  }
  update(id: string, data: any) {
    return new UpdateResourceUsecase(this.resources).execute(id, data);
  }
  delete(id: string) {
    return new DeleteResourceUsecase(this.resources).execute(id);
  }
}
