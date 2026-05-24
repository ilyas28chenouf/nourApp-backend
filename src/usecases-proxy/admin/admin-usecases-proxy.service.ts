import { Injectable } from '@nestjs/common';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { GetUsersAdminUsecase } from '../../usecases/admin/get-users-admin.usecase';
import { UpdateUserRoleUsecase } from '../../usecases/admin/update-user-role.usecase';
import { UpdateUserStatusUsecase } from '../../usecases/admin/update-user-status.usecase';

@Injectable()
export class AdminUsecasesProxyService {
  

  constructor(private readonly users: UsersTypeormAdapter) {}

  usersList() { return new GetUsersAdminUsecase(this.users).execute(); }
  updateRole(id: string, role: any) { return new UpdateUserRoleUsecase(this.users).execute(id, role); }
  updateStatus(id: string, isActive: boolean) { return new UpdateUserStatusUsecase(this.users).execute(id, isActive); }
}
