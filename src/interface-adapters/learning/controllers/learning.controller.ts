import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common-utils/decorators/current-user.decorator';
import { Roles } from '../../../common-utils/decorators/roles.decorator';
import { UserRole } from '../../../common-utils/enums/user-role.enum';
import { ProtectedApi } from '../../../common-utils/swagger/swagger.config';
import type { UserModel } from '../../../domain/users/model/user.model';
import { LearningUsecasesProxyService } from '../../../usecases-proxy/learning/learning-usecases-proxy.service';
import { CreateLearningItemRequestDto } from '../dto/request/create-learning-item.request.dto';
import { UpdateLearningProgressRequestDto } from '../dto/request/update-learning-progress.request.dto';
import { LearningItemResponseDto } from '../dto/response/learning-item.response.dto';
import { UserLearningProgressResponseDto } from '../dto/response/user-learning-progress.response.dto';
@ApiTags('Learning') @ApiBearerAuth() @ProtectedApi() @Controller('learning')
export class LearningController { constructor(private readonly proxy: LearningUsecasesProxyService) {}
  @Get('items') @ApiOperation({ summary: 'Get learning items' }) @ApiResponse({ type: [LearningItemResponseDto] }) items() { return this.proxy.items(); }
  @Get('items/:id') @ApiOperation({ summary: 'Get learning item by id' }) @ApiResponse({ type: LearningItemResponseDto }) item(@Param('id') id: string) { return this.proxy.item(id); }
  @Get('progress') @ApiOperation({ summary: 'Get learning progress' }) @ApiResponse({ type: [UserLearningProgressResponseDto] }) progress(@CurrentUser() user: UserModel) { return this.proxy.progress(user.id); }
  @Post('progress') @ApiOperation({ summary: 'Create learning progress' }) @ApiBody({ type: CreateLearningItemRequestDto }) @ApiResponse({ type: UserLearningProgressResponseDto }) createProgress(@CurrentUser() user: UserModel, @Body() dto: CreateLearningItemRequestDto) { return this.proxy.createProgress(user.id, dto); }
  @Patch('progress/:id') @ApiOperation({ summary: 'Update learning progress' }) @ApiBody({ type: UpdateLearningProgressRequestDto }) @ApiResponse({ type: UserLearningProgressResponseDto }) updateProgress(@CurrentUser() user: UserModel, @Param('id') id: string, @Body() dto: UpdateLearningProgressRequestDto) { return this.proxy.updateProgress(user.id, id, dto); }
}
