import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { DhikrUsecasesProxyService } from '../../../usecases-proxy/dhikr/dhikr-usecases-proxy.service';
import { CreateDhikrLogRequestDto } from '../dto/request/create-dhikr-log.request.dto';
import { UpdateDhikrLogRequestDto } from '../dto/request/update-dhikr-log.request.dto';
import { DhikrItemResponseDto } from '../dto/response/dhikr-item.response.dto';
import { DhikrLogResponseDto } from '../dto/response/dhikr-log.response.dto';
@ApiTags('Dhikr') @ApiBearerAuth() @ProtectedApi() @Controller('dhikr')
export class DhikrController { constructor(private readonly proxy: DhikrUsecasesProxyService) {}
  @Get('items') @ApiOperation({ summary: 'Get dhikr items' }) @ApiResponse({ type: [DhikrItemResponseDto] }) items() { return this.proxy.items(); }
  @Get('logs') @ApiOperation({ summary: 'Get dhikr logs' }) @ApiResponse({ type: [DhikrLogResponseDto] }) logs(@CurrentUser() user: UserModel, @Query('date') date?: string) { return this.proxy.logs(user.id, date); }
  @Post('logs') @ApiOperation({ summary: 'Create dhikr log' }) @ApiBody({ type: CreateDhikrLogRequestDto }) @ApiResponse({ type: DhikrLogResponseDto }) create(@CurrentUser() user: UserModel, @Body() dto: CreateDhikrLogRequestDto) { return this.proxy.createLog(user.id, dto); }
  @Patch('logs/:id') @ApiOperation({ summary: 'Update dhikr log' }) @ApiBody({ type: UpdateDhikrLogRequestDto }) @ApiResponse({ type: DhikrLogResponseDto }) update(@CurrentUser() user: UserModel, @Param('id') id: string, @Body() dto: UpdateDhikrLogRequestDto) { return this.proxy.updateLog(user.id, id, dto); }
}
