import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { FastingUsecasesProxyService } from '../../../usecases-proxy/fasting/fasting-usecases-proxy.service';
import { CreateFastingLogRequestDto } from '../dto/request/create-fasting-log.request.dto';
import { UpdateFastingLogRequestDto } from '../dto/request/update-fasting-log.request.dto';
import { FastingLogResponseDto } from '../dto/response/fasting-log.response.dto';
import { FastingRecommendedDayResponseDto } from '../dto/response/fasting-recommended-day.response.dto';
@ApiTags('Fasting') @ApiBearerAuth() @ProtectedApi() @Controller('fasting')
export class FastingController { constructor(private readonly proxy: FastingUsecasesProxyService) {}
  @Get('recommended-days') @ApiOperation({ summary: 'Get recommended fasting days' }) @ApiResponse({ type: [FastingRecommendedDayResponseDto] }) recommended(@Query('month') month?: string) { return this.proxy.recommendedDays(month); }
  @Get('logs') @ApiOperation({ summary: 'Get fasting logs' }) @ApiResponse({ type: [FastingLogResponseDto] }) logs(@CurrentUser() user: UserModel, @Query('from') from?: string, @Query('to') to?: string) { return this.proxy.logs(user.id, from, to); }
  @Post('logs') @ApiOperation({ summary: 'Create fasting log' }) @ApiBody({ type: CreateFastingLogRequestDto }) @ApiResponse({ type: FastingLogResponseDto }) create(@CurrentUser() user: UserModel, @Body() dto: CreateFastingLogRequestDto) { return this.proxy.createLog(user.id, dto); }
  @Patch('logs/:id') @ApiOperation({ summary: 'Update fasting log' }) @ApiBody({ type: UpdateFastingLogRequestDto }) @ApiResponse({ type: FastingLogResponseDto }) update(@CurrentUser() user: UserModel, @Param('id') id: string, @Body() dto: UpdateFastingLogRequestDto) { return this.proxy.updateLog(user.id, id, dto); }
  @Get('summary') @ApiOperation({ summary: 'Get fasting summary' }) @ApiResponse({ description: 'Summary' }) summary(@CurrentUser() user: UserModel, @Query('period') period: string) { return this.proxy.summary(user.id, period); }
}
