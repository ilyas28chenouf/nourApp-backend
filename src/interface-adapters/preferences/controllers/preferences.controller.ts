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
import { PreferencesUsecasesProxyService } from '../../../usecases-proxy/preferences/preferences-usecases-proxy.service';
import { UpdatePreferencesRequestDto } from '../dto/request/update-preferences.request.dto';
import { UserPreferenceResponseDto } from '../dto/response/user-preference.response.dto';
import { UserPreferenceResponseMapper } from '../mappers/user-preference.response.mapper';
@ApiTags('Preferences')
@ApiBearerAuth()
@ProtectedApi()
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly proxy: PreferencesUsecasesProxyService) {}
  @Get('me')
  @ApiOperation({ summary: 'Get current user preferences' })
  @ApiOkResponse({ type: UserPreferenceResponseDto })
  me(@CurrentUser() user: UserModel) {
    return UserPreferenceResponseMapper.toDto(
      this.proxy.getUserPreferences(user.id),
    );
  }
  @Patch('me')
  @ApiOperation({ summary: 'Update current user preferences' })
  @ApiBody({ type: UpdatePreferencesRequestDto })
  @ApiOkResponse({ type: UserPreferenceResponseDto })
  update(
    @CurrentUser() user: UserModel,
    @Body() dto: UpdatePreferencesRequestDto,
  ) {
    return UserPreferenceResponseMapper.toDto(
      this.proxy.updateUserPreferences(user.id, dto),
    );
  }
}
