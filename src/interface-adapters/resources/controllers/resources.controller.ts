import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { ResourcesUsecasesProxyService } from '../../../usecases-proxy/resources/resources-usecases-proxy.service';
import { ResourceResponseDto } from '../dto/response/resource.response.dto';
@ApiTags('Resources') @ApiBearerAuth() @ProtectedApi() @Controller('resources')
export class ResourcesController { constructor(private readonly proxy: ResourcesUsecasesProxyService) {}
  @Get() @ApiOperation({ summary: 'Get resources' }) @ApiResponse({ type: [ResourceResponseDto] }) list() { return this.proxy.list(); }
  @Get(':id') @ApiOperation({ summary: 'Get resource by id' }) @ApiResponse({ type: ResourceResponseDto }) get(@Param('id') id: string) { return this.proxy.get(id); }
}
