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
import { GoalsUsecasesProxyService } from '../../../usecases-proxy/goals/goals-usecases-proxy.service';
import { CreateGoalProgressRequestDto } from '../dto/request/create-goal-progress.request.dto';
import { GoalCatalogQueryDto } from '../dto/request/goal-catalog-query.dto';
import { GoalAnalyticsQueryDto } from '../dto/request/goal-analytics-query.dto';
import { CreateGoalRequestDto } from '../dto/request/create-goal.request.dto';
import { UpdateGoalRequestDto } from '../dto/request/update-goal.request.dto';
import { GoalProgressResponseDto } from '../dto/response/goal-progress.response.dto';
import { GoalCatalogResponseDto } from '../dto/response/goal-catalog.response.dto';
import { GoalAnalyticsResponseDto } from '../dto/response/goal-analytics.response.dto';
import { GoalResponseDto } from '../dto/response/goal.response.dto';
import { GoalResponseMapper } from '../mappers/goal.response.mapper';
@ApiTags('Goals')
@ApiBearerAuth()
@ProtectedApi()
@Controller('goals')
export class GoalsController {
  constructor(private readonly proxy: GoalsUsecasesProxyService) {}
  @Get()
  @ApiOperation({ summary: 'Get goals' })
  @ApiOkResponse({ type: [GoalResponseDto] })
  list(@CurrentUser() user: UserModel) {
    return GoalResponseMapper.toDto(this.proxy.list(user.id));
  }
  @Post()
  @ApiOperation({ summary: 'Create goal' })
  @ApiBody({ type: CreateGoalRequestDto })
  @ApiOkResponse({ type: GoalResponseDto })
  create(@CurrentUser() user: UserModel, @Body() dto: CreateGoalRequestDto) {
    return GoalResponseMapper.toDto(this.proxy.create(user.id, dto));
  }
  @Get('catalog')
  @ApiOperation({ summary: 'Get the versioned v1.6 goal catalog' })
  @ApiOkResponse({ type: [GoalCatalogResponseDto] })
  catalog(@Query() query: GoalCatalogQueryDto) {
    return this.proxy.catalog(query.category);
  }
  @Get('analytics')
  @ApiOperation({ summary: 'Get cross-domain automatic goal analytics' })
  @ApiOkResponse({ type: GoalAnalyticsResponseDto })
  analytics(
    @CurrentUser() user: UserModel,
    @Query() query: GoalAnalyticsQueryDto,
  ) {
    return this.proxy.analytics(user.id, query);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get goal by id' })
  @ApiOkResponse({ type: GoalResponseDto })
  get(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return GoalResponseMapper.toDto(this.proxy.get(user.id, id));
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update goal' })
  @ApiBody({ type: UpdateGoalRequestDto })
  @ApiOkResponse({ type: GoalResponseDto })
  update(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateGoalRequestDto,
  ) {
    return GoalResponseMapper.toDto(this.proxy.update(user.id, id, dto));
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete goal' })
  @ApiOkResponse({ description: 'Deleted' })
  delete(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return GoalResponseMapper.toDto(this.proxy.delete(user.id, id));
  }
  @Post(':id/progress')
  @ApiOperation({ summary: 'Create goal progress' })
  @ApiBody({ type: CreateGoalProgressRequestDto })
  @ApiOkResponse({ type: GoalProgressResponseDto })
  addProgress(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: CreateGoalProgressRequestDto,
  ) {
    return GoalResponseMapper.toDto(this.proxy.addProgress(user.id, id, dto));
  }
  @Get(':id/progress')
  @ApiOperation({ summary: 'Get goal progress' })
  @ApiOkResponse({ type: [GoalProgressResponseDto] })
  progress(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return GoalResponseMapper.toDto(this.proxy.progress(user.id, id));
  }
}
