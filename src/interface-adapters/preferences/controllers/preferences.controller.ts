import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { PreferencesUsecasesProxyService } from '../../../usecases-proxy/preferences/preferences-usecases-proxy.service';
import { UpdatePreferencesRequestDto } from '../dto/request/update-preferences.request.dto';
import { UserPreferenceResponseDto } from '../dto/response/user-preference.response.dto';
@ApiTags('Preferences') @ApiBearerAuth() @ProtectedApi() @Controller('preferences')
export class PreferencesController { constructor(private readonly proxy: PreferencesUsecasesProxyService) {}
  @Get('me') @ApiOperation({ summary: 'Get current user preferences' }) @ApiResponse({ type: UserPreferenceResponseDto }) me(@CurrentUser() user: UserModel) { return this.proxy.getUserPreferences(user.id); }
  @Patch('me') @ApiOperation({ summary: 'Update current user preferences' }) @ApiBody({ type: UpdatePreferencesRequestDto }) @ApiResponse({ type: UserPreferenceResponseDto }) update(@CurrentUser() user: UserModel, @Body() dto: UpdatePreferencesRequestDto) { return this.proxy.updateUserPreferences(user.id, dto); }
}
