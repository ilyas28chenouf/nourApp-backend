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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DiaryEntryType } from '../../../domain/diary/enums/diary-entry-type.enum';
import type { UserModel } from '../../../domain/users/model/user.model';
import { DiaryUsecasesProxyService } from '../../../usecases-proxy/diary/diary-usecases-proxy.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import { CreateDiaryEntryRequestDto } from '../dto/request/create-diary-entry.request.dto';
import { UpdateDiaryEntryRequestDto } from '../dto/request/update-diary-entry.request.dto';
import { DiaryEntryResponseDto } from '../dto/response/diary-entry.response.dto';
import { DiarySummaryResponseDto } from '../dto/response/diary-summary.response.dto';

@ApiTags('Diary')
@ApiBearerAuth()
@ProtectedApi()
@Controller('diary')
export class DiaryController {
  constructor(private readonly proxy: DiaryUsecasesProxyService) {}

  @Get()
  @ApiOperation({ summary: 'Get diary entries' })
  @ApiQuery({ name: 'type', enum: DiaryEntryType, required: false })
  @ApiOkResponse({ type: [DiaryEntryResponseDto] })
  list(
    @CurrentUser() user: UserModel,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('type') type?: DiaryEntryType,
  ) {
    return this.proxy.list(user.id, from, to, type);
  }

  @Post()
  @ApiOperation({ summary: 'Create diary entry' })
  @ApiBody({ type: CreateDiaryEntryRequestDto })
  @ApiOkResponse({ type: DiaryEntryResponseDto })
  create(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateDiaryEntryRequestDto,
  ) {
    return this.proxy.create(user.id, dto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get diary summary' })
  @ApiQuery({ name: 'from', example: '2026-06-01' })
  @ApiQuery({ name: 'to', example: '2026-06-14' })
  @ApiOkResponse({ type: DiarySummaryResponseDto })
  summary(
    @CurrentUser() user: UserModel,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.proxy.summary(user.id, from, to);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get diary entry by id' })
  @ApiOkResponse({ type: DiaryEntryResponseDto })
  get(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return this.proxy.get(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update diary entry' })
  @ApiBody({ type: UpdateDiaryEntryRequestDto })
  @ApiOkResponse({ type: DiaryEntryResponseDto })
  update(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateDiaryEntryRequestDto,
  ) {
    return this.proxy.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete diary entry' })
  @ApiOkResponse({ description: 'Deleted' })
  delete(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return this.proxy.delete(user.id, id);
  }
}
