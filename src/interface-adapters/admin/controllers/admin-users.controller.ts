import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../../domain/users/enums/user-role.enum';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import type { UserModel } from '../../../domain/users/model/user.model';
import { AdminUsecasesProxyService } from '../../../usecases-proxy/admin/admin-usecases-proxy.service';
import { UpdateUserRoleRequestDto } from '../dto/request/update-user-role.request.dto';
import { UpdateUserStatusRequestDto } from '../dto/request/update-user-status.request.dto';
@ApiTags('Admin')
@ApiBearerAuth()
@ProtectedApi()
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly proxy: AdminUsecasesProxyService) {}
  @Get()
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Admin list users' })
  @ApiOkResponse({ description: 'Users' })
  list() {
    return this.proxy.usersList();
  }
  @Patch(':id/role')
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Admin update user role' })
  @ApiBody({ type: UpdateUserRoleRequestDto })
  @ApiOkResponse({ description: 'User' })
  role(@Param('id') id: string, @Body() dto: UpdateUserRoleRequestDto) {
    return this.proxy.updateRole(id, dto.role);
  }
  @Patch(':id/status')
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Admin update user status' })
  @ApiBody({ type: UpdateUserStatusRequestDto })
  @ApiOkResponse({ description: 'User' })
  status(@Param('id') id: string, @Body() dto: UpdateUserStatusRequestDto) {
    return this.proxy.updateStatus(id, dto.isActive);
  }
}
