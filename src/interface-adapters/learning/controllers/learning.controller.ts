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
import { LearningUsecasesProxyService } from '../../../usecases-proxy/learning/learning-usecases-proxy.service';
import { CreateLearningItemRequestDto } from '../dto/request/create-learning-item.request.dto';
import { UpdateLearningProgressRequestDto } from '../dto/request/update-learning-progress.request.dto';
import { LearningItemResponseDto } from '../dto/response/learning-item.response.dto';
import { UserLearningProgressResponseDto } from '../dto/response/user-learning-progress.response.dto';
import { LearningResponseMapper } from '../mappers/learning.response.mapper';
@ApiTags('Learning')
@ApiBearerAuth()
@ProtectedApi()
@Controller('learning')
export class LearningController {
  constructor(private readonly proxy: LearningUsecasesProxyService) {}
  @Get('items')
  @ApiOperation({ summary: 'Get learning items' })
  @ApiOkResponse({ type: [LearningItemResponseDto] })
  items() {
    return LearningResponseMapper.toDto(this.proxy.items());
  }
  @Get('items/:id')
  @ApiOperation({ summary: 'Get learning item by id' })
  @ApiOkResponse({ type: LearningItemResponseDto })
  item(@Param('id') id: string) {
    return LearningResponseMapper.toDto(this.proxy.item(id));
  }
  @Get('progress')
  @ApiOperation({ summary: 'Get learning progress' })
  @ApiOkResponse({ type: [UserLearningProgressResponseDto] })
  progress(@CurrentUser() user: UserModel) {
    return LearningResponseMapper.toDto(this.proxy.progress(user.id));
  }
  @Post('progress')
  @ApiOperation({ summary: 'Create learning progress' })
  @ApiBody({ type: CreateLearningItemRequestDto })
  @ApiOkResponse({ type: UserLearningProgressResponseDto })
  createProgress(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateLearningItemRequestDto,
  ) {
    return LearningResponseMapper.toDto(
      this.proxy.createProgress(user.id, dto),
    );
  }
  @Patch('progress/:id')
  @ApiOperation({ summary: 'Update learning progress' })
  @ApiBody({ type: UpdateLearningProgressRequestDto })
  @ApiOkResponse({ type: UserLearningProgressResponseDto })
  updateProgress(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateLearningProgressRequestDto,
  ) {
    return LearningResponseMapper.toDto(
      this.proxy.updateProgress(user.id, id, dto),
    );
  }
}
