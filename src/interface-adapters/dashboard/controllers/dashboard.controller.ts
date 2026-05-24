import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { DashboardUsecasesProxyService } from '../../../usecases-proxy/dashboard/dashboard-usecases-proxy.service';
import { DashboardPeriodResponseDto } from '../dto/response/dashboard-period.response.dto';
import { DashboardTodayResponseDto } from '../dto/response/dashboard-today.response.dto';
@ApiTags('Dashboard') @ApiBearerAuth() @ProtectedApi() @Controller('dashboard')
export class DashboardController { constructor(private readonly proxy: DashboardUsecasesProxyService) {}
  @Get('today') @ApiOperation({ summary: 'Get today dashboard' }) @ApiResponse({ type: DashboardTodayResponseDto }) today(@CurrentUser() user: UserModel) { return this.proxy.today(user.id); }
  @Get('weekly') @ApiOperation({ summary: 'Get weekly dashboard' }) @ApiResponse({ type: DashboardPeriodResponseDto }) weekly(@CurrentUser() user: UserModel) { return this.proxy.weekly(user.id); }
  @Get('monthly') @ApiOperation({ summary: 'Get monthly dashboard' }) @ApiResponse({ type: DashboardPeriodResponseDto }) monthly(@CurrentUser() user: UserModel) { return this.proxy.monthly(user.id); }
  @Get('yearly') @ApiOperation({ summary: 'Get yearly dashboard' }) @ApiResponse({ type: DashboardPeriodResponseDto }) yearly(@CurrentUser() user: UserModel) { return this.proxy.yearly(user.id); }
  @Get('range') @ApiOperation({ summary: 'Get range dashboard' }) @ApiResponse({ type: DashboardPeriodResponseDto }) range(@CurrentUser() user: UserModel, @Query('from') from: string, @Query('to') to: string) { return this.proxy.range(user.id, from, to); }
}
