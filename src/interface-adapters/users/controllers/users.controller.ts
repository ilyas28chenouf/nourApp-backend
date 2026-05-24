import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { UsersUsecasesProxyService } from '../../../usecases-proxy/users/users-usecases-proxy.service';
import { UpdateCurrentUserRequestDto } from '../dto/request/update-current-user.request.dto';
import { UpdateUserLocationRequestDto } from '../dto/request/update-user-location.request.dto';
import { UserResponseDto } from '../dto/response/user.response.dto';

@ApiTags('Users') @ApiBearerAuth() @ProtectedApi() @Controller('users')
export class UsersController { constructor(private readonly proxy: UsersUsecasesProxyService) {}
  @Get('me') @ApiOperation({ summary: 'Get current user profile' }) @ApiResponse({ type: UserResponseDto }) me(@CurrentUser() user: UserModel) { return this.proxy.getCurrentUser(user); }
  @Patch('me') @ApiOperation({ summary: 'Update current user profile' }) @ApiBody({ type: UpdateCurrentUserRequestDto }) @ApiResponse({ type: UserResponseDto }) update(@CurrentUser() user: UserModel, @Body() dto: UpdateCurrentUserRequestDto) { return this.proxy.updateCurrentUser(user.id, dto); }
  @Patch('me/location') @ApiOperation({ summary: 'Update current user location' }) @ApiBody({ type: UpdateUserLocationRequestDto }) @ApiResponse({ type: UserResponseDto }) location(@CurrentUser() user: UserModel, @Body() dto: UpdateUserLocationRequestDto) { return this.proxy.updateUserLocation(user.id, dto); }
}
