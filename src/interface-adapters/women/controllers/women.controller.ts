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
  ApiConflictResponse,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { UserModel } from '../../../domain/users/model/user.model';
import { WomenUsecasesProxyService } from '../../../usecases-proxy/women/women-usecases-proxy.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import { CompleteWomenProgramRequestDto } from '../dto/request/complete-women-program.request.dto';
import { CreateWomenPeriodLogRequestDto } from '../dto/request/create-women-period-log.request.dto';
import { StartWomenProgramRequestDto } from '../dto/request/start-women-program.request.dto';
import { StopWomenProgramRequestDto } from '../dto/request/stop-women-program.request.dto';
import { UpdateWomenProgramActivityRequestDto } from '../dto/request/update-women-program-activity.request.dto';
import { UpdateWomenPeriodLogRequestDto } from '../dto/request/update-women-period-log.request.dto';
import { WomenProgramActivityResponseDto } from '../dto/response/women-program-activity.response.dto';
import { WomenProgramCurrentResponseDto } from '../dto/response/women-program-current.response.dto';
import { WomenProgramDayResponseDto } from '../dto/response/women-program-day.response.dto';
import { WomenProgramResponseDto } from '../dto/response/women-program.response.dto';
import { WomenPeriodLogResponseDto } from '../dto/response/women-period-log.response.dto';
import { WomenPeriodSummaryResponseDto } from '../dto/response/women-period-summary.response.dto';

@ApiTags('Women')
@ApiBearerAuth()
@ProtectedApi()
@Controller('women')
export class WomenController {
  constructor(private readonly proxy: WomenUsecasesProxyService) {}

  @Post('programs/start')
  @ApiOperation({ summary: 'Start women spiritual program' })
  @ApiBody({ type: StartWomenProgramRequestDto })
  @ApiOkResponse({ type: WomenProgramResponseDto })
  @ApiConflictResponse({
    description: 'An active women program already exists for this user',
  })
  startProgram(
    @CurrentUser() user: UserModel,
    @Body() dto: StartWomenProgramRequestDto,
  ) {
    return this.proxy.startProgram(user.id, dto);
  }

  @Get('programs/current')
  @ApiOperation({ summary: 'Get current women spiritual program' })
  @ApiQuery({ name: 'date', required: false, example: '2026-06-19' })
  @ApiOkResponse({ type: WomenProgramCurrentResponseDto })
  currentProgram(@CurrentUser() user: UserModel, @Query('date') date?: string) {
    return this.proxy.currentProgram(user.id, date);
  }

  @Get('programs/history')
  @ApiOperation({ summary: 'Get women spiritual program history' })
  @ApiQuery({ name: 'from', required: false, example: '2026-06-01' })
  @ApiQuery({ name: 'to', required: false, example: '2026-06-30' })
  @ApiOkResponse({ type: [WomenProgramResponseDto] })
  programHistory(
    @CurrentUser() user: UserModel,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.proxy.history(user.id, from, to);
  }

  @Post('programs/:id/stop')
  @ApiOperation({ summary: 'Stop active women spiritual program' })
  @ApiBody({ type: StopWomenProgramRequestDto })
  @ApiOkResponse({ type: WomenProgramResponseDto })
  stopProgram(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: StopWomenProgramRequestDto,
  ) {
    return this.proxy.stopProgram(user.id, id, dto);
  }

  @Post('programs/:id/complete')
  @ApiOperation({ summary: 'Complete active women spiritual program' })
  @ApiBody({ type: CompleteWomenProgramRequestDto })
  @ApiOkResponse({ type: WomenProgramResponseDto })
  completeProgram(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: CompleteWomenProgramRequestDto,
  ) {
    return this.proxy.completeProgram(user.id, id, dto);
  }

  @Get('programs/:id/days')
  @ApiOperation({ summary: 'Get women spiritual program days' })
  @ApiQuery({ name: 'from', example: '2026-06-01' })
  @ApiQuery({ name: 'to', example: '2026-06-30' })
  @ApiOkResponse({ type: [WomenProgramDayResponseDto] })
  programDays(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.proxy.programDays(user.id, id, from, to);
  }

  @Patch('programs/:id/days/:date/activities/:activityKey')
  @ApiOperation({ summary: 'Update women spiritual program activity' })
  @ApiBody({ type: UpdateWomenProgramActivityRequestDto })
  @ApiOkResponse({ type: WomenProgramActivityResponseDto })
  updateProgramActivity(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Param('date') date: string,
    @Param('activityKey') activityKey: string,
    @Body() dto: UpdateWomenProgramActivityRequestDto,
  ) {
    return this.proxy.updateProgramActivity(
      user.id,
      id,
      date,
      activityKey,
      dto,
    );
  }

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
