import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { GroupsUsecasesProxyService } from '../../../usecases-proxy/groups/groups-usecases-proxy.service';
import { CreateGroupEncouragementRequestDto } from '../dto/request/create-group-encouragement.request.dto';
import { CreateGroupRequestDto } from '../dto/request/create-group.request.dto';
import { JoinGroupRequestDto } from '../dto/request/join-group.request.dto';
import { UpdateGroupRequestDto } from '../dto/request/update-group.request.dto';
import { GroupMemberResponseDto } from '../dto/response/group-member.response.dto';
import { GroupProgressResponseDto } from '../dto/response/group-progress.response.dto';
import { GroupResponseDto } from '../dto/response/group.response.dto';
@ApiTags('Groups') @ApiBearerAuth() @ProtectedApi() @Controller('groups')
export class GroupsController { constructor(private readonly proxy: GroupsUsecasesProxyService) {}
  @Post() @ApiOperation({ summary: 'Create group' }) @ApiBody({ type: CreateGroupRequestDto }) @ApiResponse({ type: GroupResponseDto }) create(@CurrentUser() user: UserModel, @Body() dto: CreateGroupRequestDto) { return this.proxy.create(user.id, dto); }
  @Get('my') @ApiOperation({ summary: 'Get my groups' }) @ApiResponse({ type: [GroupResponseDto] }) my(@CurrentUser() user: UserModel) { return this.proxy.my(user.id); }
  @Get(':id') @ApiOperation({ summary: 'Get group by id' }) @ApiResponse({ type: GroupResponseDto }) get(@CurrentUser() user: UserModel, @Param('id') id: string) { return this.proxy.get(user.id, id); }
  @Patch(':id') @ApiOperation({ summary: 'Update group' }) @ApiBody({ type: UpdateGroupRequestDto }) @ApiResponse({ type: GroupResponseDto }) update(@CurrentUser() user: UserModel, @Param('id') id: string, @Body() dto: UpdateGroupRequestDto) { return this.proxy.update(user.id, id, dto); }
  @Delete(':id') @ApiOperation({ summary: 'Delete group' }) @ApiResponse({ description: 'Deleted' }) delete(@CurrentUser() user: UserModel, @Param('id') id: string) { return this.proxy.delete(user.id, id); }
  @Post('join') @ApiOperation({ summary: 'Join group' }) @ApiBody({ type: JoinGroupRequestDto }) @ApiResponse({ type: GroupMemberResponseDto }) join(@CurrentUser() user: UserModel, @Body() dto: JoinGroupRequestDto) { return this.proxy.join(user.id, dto.inviteCode); }
  @Get(':id/members') @ApiOperation({ summary: 'Get group members' }) @ApiResponse({ type: [GroupMemberResponseDto] }) members(@CurrentUser() user: UserModel, @Param('id') id: string) { return this.proxy.members(user.id, id); }
  @Delete(':id/members/:memberId') @ApiOperation({ summary: 'Remove group member' }) @ApiResponse({ description: 'Removed' }) removeMember(@CurrentUser() user: UserModel, @Param('id') id: string, @Param('memberId') memberId: string) { return this.proxy.removeMember(user.id, id, memberId); }
  @Get(':id/progress') @ApiOperation({ summary: 'Get group progress' }) @ApiResponse({ type: [GroupProgressResponseDto] }) progress(@CurrentUser() user: UserModel, @Param('id') id: string) { return this.proxy.progress(user.id, id); }
  @Post(':id/encouragements') @ApiOperation({ summary: 'Create group encouragement' }) @ApiBody({ type: CreateGroupEncouragementRequestDto }) @ApiResponse({ description: 'Encouragement' }) encourage(@CurrentUser() user: UserModel, @Param('id') id: string, @Body() dto: CreateGroupEncouragementRequestDto) { return this.proxy.encourage(user.id, id, dto); }
  @Get(':id/encouragements') @ApiOperation({ summary: 'Get group encouragements' }) @ApiResponse({ description: 'Encouragements' }) encouragements(@CurrentUser() user: UserModel, @Param('id') id: string) { return this.proxy.encouragements(user.id, id); }
}
