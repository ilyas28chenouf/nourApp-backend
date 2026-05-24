import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { AdminUsecasesProxyService } from '../../../usecases-proxy/admin/admin-usecases-proxy.service';
import { UpdateUserRoleRequestDto } from '../dto/request/update-user-role.request.dto';
import { UpdateUserStatusRequestDto } from '../dto/request/update-user-status.request.dto';
@ApiTags('Admin') @ApiBearerAuth() @ProtectedApi() @Controller('admin/users')
export class AdminUsersController { constructor(private readonly proxy: AdminUsecasesProxyService) {}
  @Get() @Roles(UserRole.SUPERADMIN) @ApiOperation({ summary: 'Admin list users' }) @ApiResponse({ description: 'Users' }) list() { return this.proxy.usersList(); }
  @Patch(':id/role') @Roles(UserRole.SUPERADMIN) @ApiOperation({ summary: 'Admin update user role' }) @ApiBody({ type: UpdateUserRoleRequestDto }) @ApiResponse({ description: 'User' }) role(@Param('id') id: string, @Body() dto: UpdateUserRoleRequestDto) { return this.proxy.updateRole(id, dto.role); }
  @Patch(':id/status') @Roles(UserRole.SUPERADMIN) @ApiOperation({ summary: 'Admin update user status' }) @ApiBody({ type: UpdateUserStatusRequestDto }) @ApiResponse({ description: 'User' }) status(@Param('id') id: string, @Body() dto: UpdateUserStatusRequestDto) { return this.proxy.updateStatus(id, dto.isActive); }
}
