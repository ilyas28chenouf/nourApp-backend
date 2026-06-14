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
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import type { UserModel } from '../../../domain/users/model/user.model';
import { PrayersUsecasesProxyService } from '../../../usecases-proxy/prayers/prayers-usecases-proxy.service';
import { CreateAdditionalPrayerLogRequestDto } from '../dto/request/create-additional-prayer-log.request.dto';
import { CreatePrayerLogRequestDto } from '../dto/request/create-prayer-log.request.dto';
import { UpdateAdditionalPrayerLogRequestDto } from '../dto/request/update-additional-prayer-log.request.dto';
import { UpdatePrayerLogRequestDto } from '../dto/request/update-prayer-log.request.dto';
import { AdditionalPrayerLogResponseDto } from '../dto/response/additional-prayer-log.response.dto';
import { PrayerLogResponseDto } from '../dto/response/prayer-log.response.dto';
import { PrayerMethodsResponseDto } from '../dto/response/prayer-methods.response.dto';
import { PrayerSummaryResponseDto } from '../dto/response/prayer-summary.response.dto';
import { PrayerTimeResponseDto } from '../dto/response/prayer-time.response.dto';
import { PrayerResponseMapper } from '../mappers/prayer.response.mapper';
@ApiTags('Prayers')
@ApiBearerAuth()
@ProtectedApi()
@Controller('prayers')
export class PrayersController {
  constructor(private readonly proxy: PrayersUsecasesProxyService) {}
  @Get('additional')
  @ApiOperation({ summary: 'Get additional prayer logs' })
  @ApiOkResponse({ type: [AdditionalPrayerLogResponseDto] })
  async additional(
    @CurrentUser() user: UserModel,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return PrayerResponseMapper.toDto(
      await this.proxy.listAdditional(user.id, from, to),
    );
  }

  @Post('additional')
  @ApiOperation({ summary: 'Create additional prayer log' })
  @ApiBody({ type: CreateAdditionalPrayerLogRequestDto })
  @ApiOkResponse({ type: AdditionalPrayerLogResponseDto })
  async createAdditional(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateAdditionalPrayerLogRequestDto,
  ) {
    return PrayerResponseMapper.toDto(
      await this.proxy.createAdditional(user.id, dto),
    );
  }

  @Get('additional/:id')
  @ApiOperation({ summary: 'Get additional prayer log by id' })
  @ApiOkResponse({ type: AdditionalPrayerLogResponseDto })
  async getAdditional(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return PrayerResponseMapper.toDto(
      await this.proxy.getAdditional(user.id, id),
    );
  }

  @Patch('additional/:id')
  @ApiOperation({ summary: 'Update additional prayer log' })
  @ApiBody({ type: UpdateAdditionalPrayerLogRequestDto })
  @ApiOkResponse({ type: AdditionalPrayerLogResponseDto })
  async updateAdditional(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateAdditionalPrayerLogRequestDto,
  ) {
    return PrayerResponseMapper.toDto(
      await this.proxy.updateAdditional(user.id, id, dto),
    );
  }

  @Delete('additional/:id')
  @ApiOperation({ summary: 'Delete additional prayer log' })
  @ApiOkResponse({ description: 'Deleted' })
  async deleteAdditional(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
  ) {
    return PrayerResponseMapper.toDto(
      await this.proxy.deleteAdditional(user.id, id),
    );
  }

  @Get('times')
  @ApiOperation({ summary: 'Get prayer times for date' })
  @ApiQuery({ name: 'date', example: '2026-06-02' })
  @ApiOkResponse({ type: PrayerTimeResponseDto })
  @ApiBadRequestResponse({
    description:
      'User location and timezone are required to calculate prayer times',
  })
  @ApiBadGatewayResponse({
    description: 'Unable to fetch prayer times from provider',
  })
  async times(@CurrentUser() user: UserModel, @Query('date') date: string) {
    return PrayerResponseMapper.toPrayerTimeDto(
      await this.proxy.getPrayerTimes(user.id, date),
    );
  }

  @Get('methods')
  @ApiOperation({ summary: 'Get available prayer calculation methods' })
  @ApiOkResponse({ type: PrayerMethodsResponseDto })
  @ApiBadGatewayResponse({
    description: 'Unable to fetch prayer times from provider',
  })
  async methods() {
    return PrayerResponseMapper.toDto(await this.proxy.getPrayerMethods());
  }
  @Get('logs')
  @ApiOperation({ summary: 'Get prayer logs' })
  @ApiOkResponse({ type: [PrayerLogResponseDto] })
  async logs(
    @CurrentUser() user: UserModel,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return PrayerResponseMapper.toDto(
      await this.proxy.getPrayerLogs(user.id, from, to),
    );
  }
  @Post('logs')
  @ApiOperation({ summary: 'Create prayer log' })
  @ApiBody({ type: CreatePrayerLogRequestDto })
  @ApiOkResponse({ type: PrayerLogResponseDto })
  async create(
    @CurrentUser() user: UserModel,
    @Body() dto: CreatePrayerLogRequestDto,
  ) {
    return PrayerResponseMapper.toDto(
      await this.proxy.createPrayerLog(user.id, dto),
    );
  }
  @Patch('logs/:id')
  @ApiOperation({ summary: 'Update prayer log' })
  @ApiBody({ type: UpdatePrayerLogRequestDto })
  @ApiOkResponse({ type: PrayerLogResponseDto })
  async update(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdatePrayerLogRequestDto,
  ) {
    return PrayerResponseMapper.toDto(
      await this.proxy.updatePrayerLog(user.id, id, dto),
    );
  }
  @Delete('logs/:id')
  @ApiOperation({ summary: 'Delete prayer log' })
  @ApiOkResponse({ description: 'Deleted' })
  async delete(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return PrayerResponseMapper.toDto(
      await this.proxy.deletePrayerLog(user.id, id),
    );
  }
  @Get('summary')
  @ApiOperation({ summary: 'Get prayer summary' })
  @ApiOkResponse({ type: PrayerSummaryResponseDto })
  async summary(
    @CurrentUser() user: UserModel,
    @Query('period') period: string,
  ) {
    return PrayerResponseMapper.toDto(
      await this.proxy.getPrayerSummary(user.id, period),
    );
  }
}
