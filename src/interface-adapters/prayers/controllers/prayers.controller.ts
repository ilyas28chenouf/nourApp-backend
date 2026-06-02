import {
  Body,
  Controller,
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
import { CreatePrayerLogRequestDto } from '../dto/request/create-prayer-log.request.dto';
import { UpdatePrayerLogRequestDto } from '../dto/request/update-prayer-log.request.dto';
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
  methods() {
    return PrayerResponseMapper.toDto(this.proxy.getPrayerMethods());
  }
  @Get('logs')
  @ApiOperation({ summary: 'Get prayer logs' })
  @ApiOkResponse({ type: [PrayerLogResponseDto] })
  logs(
    @CurrentUser() user: UserModel,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return PrayerResponseMapper.toDto(
      this.proxy.getPrayerLogs(user.id, from, to),
    );
  }
  @Post('logs')
  @ApiOperation({ summary: 'Create prayer log' })
  @ApiBody({ type: CreatePrayerLogRequestDto })
  @ApiOkResponse({ type: PrayerLogResponseDto })
  create(
    @CurrentUser() user: UserModel,
    @Body() dto: CreatePrayerLogRequestDto,
  ) {
    return PrayerResponseMapper.toDto(this.proxy.createPrayerLog(user.id, dto));
  }
  @Patch('logs/:id')
  @ApiOperation({ summary: 'Update prayer log' })
  @ApiBody({ type: UpdatePrayerLogRequestDto })
  @ApiOkResponse({ type: PrayerLogResponseDto })
  update(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdatePrayerLogRequestDto,
  ) {
    return PrayerResponseMapper.toDto(
      this.proxy.updatePrayerLog(user.id, id, dto),
    );
  }
  @Get('summary')
  @ApiOperation({ summary: 'Get prayer summary' })
  @ApiOkResponse({ type: PrayerSummaryResponseDto })
  summary(@CurrentUser() user: UserModel, @Query('period') period: string) {
    return PrayerResponseMapper.toDto(
      this.proxy.getPrayerSummary(user.id, period),
    );
  }
}
