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
import { GroupsUsecasesProxyService } from '../../../usecases-proxy/groups/groups-usecases-proxy.service';
import { GoalsUsecasesProxyService } from '../../../usecases-proxy/goals/goals-usecases-proxy.service';
import { CreateGroupGoalRequestDto } from '../../goals/dto/request/create-group-goal.request.dto';
import { GoalResponseDto } from '../../goals/dto/response/goal.response.dto';
import { GoalResponseMapper } from '../../goals/mappers/goal.response.mapper';
import { CreateGroupEncouragementRequestDto } from '../dto/request/create-group-encouragement.request.dto';
import { CreateGroupRequestDto } from '../dto/request/create-group.request.dto';
import { JoinGroupRequestDto } from '../dto/request/join-group.request.dto';
import { UpdateGroupRequestDto } from '../dto/request/update-group.request.dto';
import { GroupMemberResponseDto } from '../dto/response/group-member.response.dto';
import { GroupProgressResponseDto } from '../dto/response/group-progress.response.dto';
import { GroupResponseDto } from '../dto/response/group.response.dto';
import { GroupResponseMapper } from '../mappers/group.response.mapper';
@ApiTags('Groups')
@ApiBearerAuth()
@ProtectedApi()
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly proxy: GroupsUsecasesProxyService,
    private readonly goalsProxy: GoalsUsecasesProxyService,
  ) {}
  @Post()
  @ApiOperation({ summary: 'Create group' })
  @ApiBody({ type: CreateGroupRequestDto })
  @ApiOkResponse({ type: GroupResponseDto })
  create(@CurrentUser() user: UserModel, @Body() dto: CreateGroupRequestDto) {
    return GroupResponseMapper.toDto(this.proxy.create(user.id, dto));
  }
  @Get('my')
  @ApiOperation({ summary: 'Get my groups' })
  @ApiOkResponse({ type: [GroupResponseDto] })
  my(@CurrentUser() user: UserModel) {
    return GroupResponseMapper.toDto(this.proxy.my(user.id));
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get group by id' })
  @ApiOkResponse({ type: GroupResponseDto })
  get(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return GroupResponseMapper.toDto(this.proxy.get(user.id, id));
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update group' })
  @ApiBody({ type: UpdateGroupRequestDto })
  @ApiOkResponse({ type: GroupResponseDto })
  update(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateGroupRequestDto,
  ) {
    return GroupResponseMapper.toDto(this.proxy.update(user.id, id, dto));
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  @ApiOkResponse({ description: 'Deleted' })
  delete(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return GroupResponseMapper.toDto(this.proxy.delete(user.id, id));
  }
  @Post('join')
  @ApiOperation({ summary: 'Join group' })
  @ApiBody({ type: JoinGroupRequestDto })
  @ApiOkResponse({ type: GroupMemberResponseDto })
  join(@CurrentUser() user: UserModel, @Body() dto: JoinGroupRequestDto) {
    return GroupResponseMapper.toDto(this.proxy.join(user.id, dto.inviteCode));
  }
  @Get(':id/members')
  @ApiOperation({ summary: 'Get group members' })
  @ApiOkResponse({ type: [GroupMemberResponseDto] })
  members(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return GroupResponseMapper.toDto(this.proxy.members(user.id, id));
  }
  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove group member' })
  @ApiOkResponse({ description: 'Removed' })
  removeMember(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return GroupResponseMapper.toDto(
      this.proxy.removeMember(user.id, id, memberId),
    );
  }
  @Get(':id/progress')
  @ApiOperation({ summary: 'Get group progress' })
  @ApiOkResponse({ type: [GroupProgressResponseDto] })
  progress(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return GroupResponseMapper.toDto(this.proxy.progress(user.id, id));
  }
  @Get(':id/goals')
  @ApiOperation({ summary: 'Get group goals' })
  @ApiOkResponse({ type: [GoalResponseDto] })
  async goals(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return GoalResponseMapper.toDto(
      await this.goalsProxy.listGroupGoals(user.id, id),
    );
  }

  @Post(':id/goals')
  @ApiOperation({ summary: 'Create group goal' })
  @ApiBody({ type: CreateGroupGoalRequestDto })
  @ApiOkResponse({ type: GoalResponseDto })
  async createGoal(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: CreateGroupGoalRequestDto,
  ) {
    return GoalResponseMapper.toDto(
      await this.goalsProxy.createGroupGoal(user.id, id, dto),
    );
  }
  @Post(':id/encouragements')
  @ApiOperation({ summary: 'Create group encouragement' })
  @ApiBody({ type: CreateGroupEncouragementRequestDto })
  @ApiOkResponse({ description: 'Encouragement' })
  encourage(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: CreateGroupEncouragementRequestDto,
  ) {
    return GroupResponseMapper.toDto(this.proxy.encourage(user.id, id, dto));
  }
  @Get(':id/encouragements')
  @ApiOperation({ summary: 'Get group encouragements' })
  @ApiOkResponse({ description: 'Encouragements' })
  encouragements(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return GroupResponseMapper.toDto(this.proxy.encouragements(user.id, id));
  }
}
