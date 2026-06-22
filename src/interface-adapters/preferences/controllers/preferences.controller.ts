import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import type { UserModel } from '../../../domain/users/model/user.model';
import { AppLoggerService } from '../../../infrastructure/logger/app-logger.service';
import { PreferencesUsecasesProxyService } from '../../../usecases-proxy/preferences/preferences-usecases-proxy.service';
import { UpdateOnboardingPreferencesRequestDto } from '../dto/request/update-onboarding-preferences.request.dto';
import { UpdatePreferencesRequestDto } from '../dto/request/update-preferences.request.dto';
import { UserPreferenceResponseDto } from '../dto/response/user-preference.response.dto';
import { UserPreferenceResponseMapper } from '../mappers/user-preference.response.mapper';
@ApiTags('Preferences')
@ApiBearerAuth()
@ProtectedApi()
@Controller('preferences')
export class PreferencesController {
  constructor(
    private readonly proxy: PreferencesUsecasesProxyService,
    private readonly logger: AppLoggerService,
  ) {}
  @Get('me')
  @ApiOperation({ summary: 'Get current user preferences' })
  @ApiOkResponse({ type: UserPreferenceResponseDto })
  async me(@CurrentUser() user: UserModel) {
    return UserPreferenceResponseMapper.toDto(
      await this.proxy.getUserPreferences(user.id),
    );
  }
  @Patch('me')
  @ApiOperation({ summary: 'Update current user preferences' })
  @ApiBody({ type: UpdatePreferencesRequestDto })
  @ApiOkResponse({ type: UserPreferenceResponseDto })
  async update(
    @CurrentUser() user: UserModel,
    @Body() dto: UpdatePreferencesRequestDto,
  ) {
    return UserPreferenceResponseMapper.toDto(
      await this.proxy.updateUserPreferences(user.id, dto),
    );
  }

  @Patch('me/onboarding')
  @ApiOperation({ summary: 'Update current user onboarding preferences' })
  @ApiBody({ type: UpdateOnboardingPreferencesRequestDto })
  @ApiOkResponse({ type: UserPreferenceResponseDto })
  async onboarding(
    @CurrentUser() user: UserModel,
    @Body() dto: UpdateOnboardingPreferencesRequestDto,
  ) {
    this.logger.debug('Onboarding preferences incoming DTO', {
      userId: user.id,
      dto,
    });
    const updated = await this.proxy.updateOnboardingPreferences(user.id, dto);
    this.logger.debug('Onboarding preferences saved entity before response', {
      userId: user.id,
      saved: updated,
    });
    const response = UserPreferenceResponseMapper.toDto(updated);
    this.logger.debug('Onboarding preferences response DTO', {
      userId: user.id,
      response,
    });
    return response;
  }
}
