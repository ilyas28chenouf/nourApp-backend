import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { MeditationUsecasesProxyService } from '../../../usecases-proxy/meditation/meditation-usecases-proxy.service';
import { CreateMeditationLogRequestDto } from '../dto/request/create-meditation-log.request.dto';
import { UpdateMeditationLogRequestDto } from '../dto/request/update-meditation-log.request.dto';
import { MeditationLogResponseDto } from '../dto/response/meditation-log.response.dto';
@ApiTags('Meditation') @ApiBearerAuth() @ProtectedApi() @Controller('meditation')
export class MeditationController { constructor(private readonly proxy: MeditationUsecasesProxyService) {}
  @Get('logs') @ApiOperation({ summary: 'Get meditation logs' }) @ApiResponse({ type: [MeditationLogResponseDto] }) logs(@CurrentUser() user: UserModel, @Query('from') from?: string, @Query('to') to?: string) { return this.proxy.logs(user.id, from, to); }
  @Post('logs') @ApiOperation({ summary: 'Create meditation log' }) @ApiBody({ type: CreateMeditationLogRequestDto }) @ApiResponse({ type: MeditationLogResponseDto }) create(@CurrentUser() user: UserModel, @Body() dto: CreateMeditationLogRequestDto) { return this.proxy.createLog(user.id, dto); }
  @Patch('logs/:id') @ApiOperation({ summary: 'Update meditation log' }) @ApiBody({ type: UpdateMeditationLogRequestDto }) @ApiResponse({ type: MeditationLogResponseDto }) update(@CurrentUser() user: UserModel, @Param('id') id: string, @Body() dto: UpdateMeditationLogRequestDto) { return this.proxy.updateLog(user.id, id, dto); }
  @Delete('logs/:id') @ApiOperation({ summary: 'Delete meditation log' }) @ApiResponse({ description: 'Deleted' }) delete(@CurrentUser() user: UserModel, @Param('id') id: string) { return this.proxy.deleteLog(user.id, id); }
}
