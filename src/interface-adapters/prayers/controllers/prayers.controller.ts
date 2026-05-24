import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { PrayersUsecasesProxyService } from '../../../usecases-proxy/prayers/prayers-usecases-proxy.service';
import { CreatePrayerLogRequestDto } from '../dto/request/create-prayer-log.request.dto';
import { UpdatePrayerLogRequestDto } from '../dto/request/update-prayer-log.request.dto';
import { PrayerLogResponseDto } from '../dto/response/prayer-log.response.dto';
import { PrayerSummaryResponseDto } from '../dto/response/prayer-summary.response.dto';
import { PrayerTimeResponseDto } from '../dto/response/prayer-time.response.dto';
@ApiTags('Prayers') @ApiBearerAuth() @ProtectedApi() @Controller('prayers')
export class PrayersController { constructor(private readonly proxy: PrayersUsecasesProxyService) {}
  @Get('times') @ApiOperation({ summary: 'Get prayer times for date' }) @ApiResponse({ type: PrayerTimeResponseDto }) times(@CurrentUser() user: UserModel, @Query('date') date: string) { return this.proxy.getPrayerTimes(user.id, date); }
  @Get('logs') @ApiOperation({ summary: 'Get prayer logs' }) @ApiResponse({ type: [PrayerLogResponseDto] }) logs(@CurrentUser() user: UserModel, @Query('from') from?: string, @Query('to') to?: string) { return this.proxy.getPrayerLogs(user.id, from, to); }
  @Post('logs') @ApiOperation({ summary: 'Create prayer log' }) @ApiBody({ type: CreatePrayerLogRequestDto }) @ApiResponse({ type: PrayerLogResponseDto }) create(@CurrentUser() user: UserModel, @Body() dto: CreatePrayerLogRequestDto) { return this.proxy.createPrayerLog(user.id, dto); }
  @Patch('logs/:id') @ApiOperation({ summary: 'Update prayer log' }) @ApiBody({ type: UpdatePrayerLogRequestDto }) @ApiResponse({ type: PrayerLogResponseDto }) update(@CurrentUser() user: UserModel, @Param('id') id: string, @Body() dto: UpdatePrayerLogRequestDto) { return this.proxy.updatePrayerLog(user.id, id, dto); }
  @Get('summary') @ApiOperation({ summary: 'Get prayer summary' }) @ApiResponse({ type: PrayerSummaryResponseDto }) summary(@CurrentUser() user: UserModel, @Query('period') period: string) { return this.proxy.getPrayerSummary(user.id, period); }
}
