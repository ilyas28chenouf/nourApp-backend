import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { ResourcesUsecasesProxyService } from '../../../usecases-proxy/resources/resources-usecases-proxy.service';
import { CreateResourceRequestDto } from '../../resources/dto/request/create-resource.request.dto';
import { UpdateResourceRequestDto } from '../../resources/dto/request/update-resource.request.dto';
@ApiTags('Admin Resources') @ApiBearerAuth() @ProtectedApi() @Controller('admin/resources')
export class AdminResourcesController { constructor(private readonly resources: ResourcesUsecasesProxyService) {}
  @Post() @Roles(UserRole.ADMIN, UserRole.SUPERADMIN) @ApiOperation({ summary: 'Admin create resource' }) @ApiBody({ type: CreateResourceRequestDto }) @ApiResponse({ description: 'Resource' }) create(@CurrentUser() user: UserModel, @Body() dto: CreateResourceRequestDto) { return this.resources.create(user.id, dto); }
  @Patch(':id') @Roles(UserRole.ADMIN, UserRole.SUPERADMIN) @ApiOperation({ summary: 'Admin update resource' }) @ApiBody({ type: UpdateResourceRequestDto }) @ApiResponse({ description: 'Resource' }) update(@Param('id') id: string, @Body() dto: UpdateResourceRequestDto) { return this.resources.update(id, dto); }
  @Delete(':id') @Roles(UserRole.ADMIN, UserRole.SUPERADMIN) @ApiOperation({ summary: 'Admin delete resource' }) @ApiResponse({ description: 'Deleted' }) delete(@Param('id') id: string) { return this.resources.delete(id); }
}
