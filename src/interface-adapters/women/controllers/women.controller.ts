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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { UserModel } from '../../../domain/users/model/user.model';
import { WomenUsecasesProxyService } from '../../../usecases-proxy/women/women-usecases-proxy.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import { CreateWomenPeriodLogRequestDto } from '../dto/request/create-women-period-log.request.dto';
import { UpdateWomenPeriodLogRequestDto } from '../dto/request/update-women-period-log.request.dto';
import { WomenPeriodLogResponseDto } from '../dto/response/women-period-log.response.dto';
import { WomenPeriodSummaryResponseDto } from '../dto/response/women-period-summary.response.dto';

@ApiTags('Women')
@ApiBearerAuth()
@ProtectedApi()
@Controller('women')
export class WomenController {
  constructor(private readonly proxy: WomenUsecasesProxyService) {}

  @Get('period-logs')
  @ApiOperation({ summary: 'Get women period logs' })
  @ApiOkResponse({ type: [WomenPeriodLogResponseDto] })
  list(
    @CurrentUser() user: UserModel,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.proxy.list(user.id, from, to);
  }

  @Post('period-logs')
  @ApiOperation({ summary: 'Create women period log' })
  @ApiBody({ type: CreateWomenPeriodLogRequestDto })
  @ApiOkResponse({ type: WomenPeriodLogResponseDto })
  create(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateWomenPeriodLogRequestDto,
  ) {
    return this.proxy.create(user.id, dto);
  }

  @Get('period-logs/summary')
  @ApiOperation({ summary: 'Get women period log summary' })
  @ApiQuery({ name: 'from', example: '2026-06-01' })
  @ApiQuery({ name: 'to', example: '2026-06-14' })
  @ApiOkResponse({ type: WomenPeriodSummaryResponseDto })
  summary(
    @CurrentUser() user: UserModel,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.proxy.summary(user.id, from, to);
  }

  @Get('period-logs/:id')
  @ApiOperation({ summary: 'Get women period log by id' })
  @ApiOkResponse({ type: WomenPeriodLogResponseDto })
  get(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return this.proxy.get(user.id, id);
  }

  @Patch('period-logs/:id')
  @ApiOperation({ summary: 'Update women period log' })
  @ApiBody({ type: UpdateWomenPeriodLogRequestDto })
  @ApiOkResponse({ type: WomenPeriodLogResponseDto })
  update(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateWomenPeriodLogRequestDto,
  ) {
    return this.proxy.update(user.id, id, dto);
  }

  @Delete('period-logs/:id')
  @ApiOperation({ summary: 'Delete women period log' })
  @ApiOkResponse({ description: 'Deleted' })
  delete(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return this.proxy.delete(user.id, id);
  }
}
