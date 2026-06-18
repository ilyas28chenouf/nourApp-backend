import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
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
import { NotificationsUsecasesProxyService } from '../../../usecases-proxy/notifications/notifications-usecases-proxy.service';
import { PreferencesUsecasesProxyService } from '../../../usecases-proxy/preferences/preferences-usecases-proxy.service';
import { UpdatePreferencesRequestDto } from '../../preferences/dto/request/update-preferences.request.dto';
import { UserPreferenceResponseDto } from '../../preferences/dto/response/user-preference.response.dto';
import { UserPreferenceResponseMapper } from '../../preferences/mappers/user-preference.response.mapper';
import { RegisterDeviceTokenRequestDto } from '../dto/request/register-device-token.request.dto';
import { DeviceTokenResponseDto } from '../dto/response/device-token.response.dto';
import { ScheduledNotificationResponseDto } from '../dto/response/scheduled-notification.response.dto';
import { NotificationResponseMapper } from '../mappers/notification.response.mapper';
@ApiTags('Notifications')
@ApiBearerAuth()
@ProtectedApi()
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly proxy: NotificationsUsecasesProxyService,
    private readonly preferencesProxy: PreferencesUsecasesProxyService,
  ) {}

  @Post('device-token')
  @ApiOperation({ summary: 'Register device token' })
  @ApiBody({ type: RegisterDeviceTokenRequestDto })
  @ApiOkResponse({ type: DeviceTokenResponseDto })
  async register(
    @CurrentUser() user: UserModel,
    @Body() dto: RegisterDeviceTokenRequestDto,
  ) {
    return NotificationResponseMapper.toDeviceTokenDto(
      await this.proxy.registerDeviceToken(user.id, dto),
    );
  }

  @Get('scheduled')
  @ApiOperation({ summary: 'Get scheduled notifications' })
  @ApiOkResponse({ type: [ScheduledNotificationResponseDto] })
  async scheduled(
    @CurrentUser() user: UserModel,
    @Query('limit') limit?: string,
  ) {
    return NotificationResponseMapper.toScheduledDtoList(
      await this.proxy.scheduled(user.id, limit ? Number(limit) : undefined),
    );
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiBody({ type: UpdatePreferencesRequestDto })
  @ApiOkResponse({ type: UserPreferenceResponseDto })
  async preferences(
    @CurrentUser() user: UserModel,
    @Body() dto: UpdatePreferencesRequestDto,
  ) {
    return UserPreferenceResponseMapper.toDto(
      await this.preferencesProxy.updateUserPreferences(user.id, dto),
    );
  }

  @Post('test')
  @ApiOperation({ summary: 'Send test notification' })
  @ApiOkResponse({ type: ScheduledNotificationResponseDto })
  async test(@CurrentUser() user: UserModel) {
    return NotificationResponseMapper.toScheduledDto(
      await this.proxy.sendTest(user.id),
    );
  }
}
