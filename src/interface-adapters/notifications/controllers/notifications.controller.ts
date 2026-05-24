import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { NotificationsUsecasesProxyService } from '../../../usecases-proxy/notifications/notifications-usecases-proxy.service';
import { UpdatePreferencesRequestDto } from '../../preferences/dto/request/update-preferences.request.dto';
import { RegisterDeviceTokenRequestDto } from '../dto/request/register-device-token.request.dto';
import { ScheduledNotificationResponseDto } from '../dto/response/scheduled-notification.response.dto';
@ApiTags('Notifications') @ApiBearerAuth() @ProtectedApi() @Controller('notifications')
export class NotificationsController { constructor(private readonly proxy: NotificationsUsecasesProxyService) {}
  @Post('device-token') @ApiOperation({ summary: 'Register device token' }) @ApiBody({ type: RegisterDeviceTokenRequestDto }) @ApiResponse({ description: 'Device token' }) register(@CurrentUser() user: UserModel, @Body() dto: RegisterDeviceTokenRequestDto) { return this.proxy.registerDeviceToken(user.id, dto); }
  @Get('scheduled') @ApiOperation({ summary: 'Get scheduled notifications' }) @ApiResponse({ type: [ScheduledNotificationResponseDto] }) scheduled(@CurrentUser() user: UserModel) { return this.proxy.scheduled(user.id); }
  @Patch('preferences') @ApiOperation({ summary: 'Update notification preferences' }) @ApiBody({ type: UpdatePreferencesRequestDto }) @ApiResponse({ description: 'Preferences updated' }) preferences(@CurrentUser() user: UserModel, @Body() dto: UpdatePreferencesRequestDto) { return { userId: user.id, ...dto }; }
  @Post('test') @ApiOperation({ summary: 'Send test notification' }) @ApiResponse({ type: ScheduledNotificationResponseDto }) test(@CurrentUser() user: UserModel, @Body() dto: any) { return this.proxy.sendTest(user.id, dto); }
}
