import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { GoalsUsecasesProxyService } from '../../../usecases-proxy/goals/goals-usecases-proxy.service';
import { CreateGoalProgressRequestDto } from '../dto/request/create-goal-progress.request.dto';
import { CreateGoalRequestDto } from '../dto/request/create-goal.request.dto';
import { UpdateGoalRequestDto } from '../dto/request/update-goal.request.dto';
import { GoalProgressResponseDto } from '../dto/response/goal-progress.response.dto';
import { GoalResponseDto } from '../dto/response/goal.response.dto';
@ApiTags('Goals') @ApiBearerAuth() @ProtectedApi() @Controller('goals')
export class GoalsController { constructor(private readonly proxy: GoalsUsecasesProxyService) {}
  @Get() @ApiOperation({ summary: 'Get goals' }) @ApiResponse({ type: [GoalResponseDto] }) list(@CurrentUser() user: UserModel) { return this.proxy.list(user.id); }
  @Post() @ApiOperation({ summary: 'Create goal' }) @ApiBody({ type: CreateGoalRequestDto }) @ApiResponse({ type: GoalResponseDto }) create(@CurrentUser() user: UserModel, @Body() dto: CreateGoalRequestDto) { return this.proxy.create(user.id, dto); }
  @Get(':id') @ApiOperation({ summary: 'Get goal by id' }) @ApiResponse({ type: GoalResponseDto }) get(@CurrentUser() user: UserModel, @Param('id') id: string) { return this.proxy.get(user.id, id); }
  @Patch(':id') @ApiOperation({ summary: 'Update goal' }) @ApiBody({ type: UpdateGoalRequestDto }) @ApiResponse({ type: GoalResponseDto }) update(@CurrentUser() user: UserModel, @Param('id') id: string, @Body() dto: UpdateGoalRequestDto) { return this.proxy.update(user.id, id, dto); }
  @Delete(':id') @ApiOperation({ summary: 'Delete goal' }) @ApiResponse({ description: 'Deleted' }) delete(@CurrentUser() user: UserModel, @Param('id') id: string) { return this.proxy.delete(user.id, id); }
  @Post(':id/progress') @ApiOperation({ summary: 'Create goal progress' }) @ApiBody({ type: CreateGoalProgressRequestDto }) @ApiResponse({ type: GoalProgressResponseDto }) addProgress(@CurrentUser() user: UserModel, @Param('id') id: string, @Body() dto: CreateGoalProgressRequestDto) { return this.proxy.addProgress(user.id, id, dto); }
  @Get(':id/progress') @ApiOperation({ summary: 'Get goal progress' }) @ApiResponse({ type: [GoalProgressResponseDto] }) progress(@CurrentUser() user: UserModel, @Param('id') id: string) { return this.proxy.progress(user.id, id); }
}
