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
import { QuranUsecasesProxyService } from '../../../usecases-proxy/quran/quran-usecases-proxy.service';
import { CreateQuranReadingGoalRequestDto } from '../dto/request/create-quran-reading-goal.request.dto';
import { CreateQuranReadingLogRequestDto } from '../dto/request/create-quran-reading-log.request.dto';
import { UpdateQuranReadingGoalRequestDto } from '../dto/request/update-quran-reading-goal.request.dto';
import { UpdateQuranReadingLogRequestDto } from '../dto/request/update-quran-reading-log.request.dto';
import { QuranReadingGoalResponseDto } from '../dto/response/quran-reading-goal.response.dto';
import { QuranReadingLogResponseDto } from '../dto/response/quran-reading-log.response.dto';
import { QuranResponseMapper } from '../mappers/quran.response.mapper';
@ApiTags('Quran')
@ApiBearerAuth()
@ProtectedApi()
@Controller('quran')
export class QuranController {
  constructor(private readonly proxy: QuranUsecasesProxyService) {}
  @Get('logs')
  @ApiOperation({ summary: 'Get Quran reading logs' })
  @ApiOkResponse({ type: [QuranReadingLogResponseDto] })
  logs(
    @CurrentUser() user: UserModel,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return QuranResponseMapper.toDto(this.proxy.logs(user.id, from, to));
  }
  @Post('logs')
  @ApiOperation({ summary: 'Create Quran reading log' })
  @ApiBody({ type: CreateQuranReadingLogRequestDto })
  @ApiOkResponse({ type: QuranReadingLogResponseDto })
  createLog(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateQuranReadingLogRequestDto,
  ) {
    return QuranResponseMapper.toDto(this.proxy.createLog(user.id, dto));
  }
  @Patch('logs/:id')
  @ApiOperation({ summary: 'Update Quran reading log' })
  @ApiBody({ type: UpdateQuranReadingLogRequestDto })
  @ApiOkResponse({ type: QuranReadingLogResponseDto })
  updateLog(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateQuranReadingLogRequestDto,
  ) {
    return QuranResponseMapper.toDto(this.proxy.updateLog(user.id, id, dto));
  }
  @Get('goals')
  @ApiOperation({ summary: 'Get Quran reading goals' })
  @ApiOkResponse({ type: [QuranReadingGoalResponseDto] })
  goals(@CurrentUser() user: UserModel) {
    return QuranResponseMapper.toDto(this.proxy.goals(user.id));
  }
  @Post('goals')
  @ApiOperation({ summary: 'Create Quran reading goal' })
  @ApiBody({ type: CreateQuranReadingGoalRequestDto })
  @ApiOkResponse({ type: QuranReadingGoalResponseDto })
  createGoal(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateQuranReadingGoalRequestDto,
  ) {
    return QuranResponseMapper.toDto(this.proxy.createGoal(user.id, dto));
  }
  @Patch('goals/:id')
  @ApiOperation({ summary: 'Update Quran reading goal' })
  @ApiBody({ type: UpdateQuranReadingGoalRequestDto })
  @ApiOkResponse({ type: QuranReadingGoalResponseDto })
  updateGoal(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateQuranReadingGoalRequestDto,
  ) {
    return QuranResponseMapper.toDto(this.proxy.updateGoal(user.id, id, dto));
  }
  @Delete('goals/:id')
  @ApiOperation({ summary: 'Delete Quran reading goal' })
  @ApiOkResponse({ description: 'Deleted' })
  deleteGoal(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return QuranResponseMapper.toDto(this.proxy.deleteGoal(user.id, id));
  }
  @Get('summary')
  @ApiOperation({ summary: 'Get Quran summary' })
  @ApiOkResponse({ description: 'Summary' })
  summary(@CurrentUser() user: UserModel, @Query('period') period: string) {
    return QuranResponseMapper.toDto(this.proxy.summary(user.id, period));
  }
}
