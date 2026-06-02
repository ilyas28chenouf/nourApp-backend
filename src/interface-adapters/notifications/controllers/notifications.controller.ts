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
import { NotificationsUsecasesProxyService } from '../../../usecases-proxy/notifications/notifications-usecases-proxy.service';
import { UpdatePreferencesRequestDto } from '../../preferences/dto/request/update-preferences.request.dto';
import { RegisterDeviceTokenRequestDto } from '../dto/request/register-device-token.request.dto';
import { ScheduledNotificationResponseDto } from '../dto/response/scheduled-notification.response.dto';
import { NotificationResponseMapper } from '../mappers/notification.response.mapper';
@ApiTags('Notifications')
@ApiBearerAuth()
@ProtectedApi()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly proxy: NotificationsUsecasesProxyService) {}
  @Post('device-token')
  @ApiOperation({ summary: 'Register device token' })
  @ApiBody({ type: RegisterDeviceTokenRequestDto })
  @ApiOkResponse({ description: 'Device token' })
  register(
    @CurrentUser() user: UserModel,
    @Body() dto: RegisterDeviceTokenRequestDto,
  ) {
    return NotificationResponseMapper.toDto(
      this.proxy.registerDeviceToken(user.id, dto),
    );
  }
  @Get('scheduled')
  @ApiOperation({ summary: 'Get scheduled notifications' })
  @ApiOkResponse({ type: [ScheduledNotificationResponseDto] })
  scheduled(@CurrentUser() user: UserModel) {
    return NotificationResponseMapper.toDto(this.proxy.scheduled(user.id));
  }
  @Patch('preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiBody({ type: UpdatePreferencesRequestDto })
  @ApiOkResponse({ description: 'Preferences updated' })
  preferences(
    @CurrentUser() user: UserModel,
    @Body() dto: UpdatePreferencesRequestDto,
  ) {
    return { userId: user.id, ...dto };
  }
  @Post('test')
  @ApiOperation({ summary: 'Send test notification' })
  @ApiOkResponse({ type: ScheduledNotificationResponseDto })
  test(@CurrentUser() user: UserModel, @Body() dto: any) {
    return NotificationResponseMapper.toDto(this.proxy.sendTest(user.id, dto));
  }
}
