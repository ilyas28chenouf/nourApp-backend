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
import { MeditationUsecasesProxyService } from '../../../usecases-proxy/meditation/meditation-usecases-proxy.service';
import { CreateMeditationLogRequestDto } from '../dto/request/create-meditation-log.request.dto';
import { UpdateMeditationLogRequestDto } from '../dto/request/update-meditation-log.request.dto';
import { MeditationLogResponseDto } from '../dto/response/meditation-log.response.dto';
import { MeditationResponseMapper } from '../mappers/meditation.response.mapper';
@ApiTags('Meditation')
@ApiBearerAuth()
@ProtectedApi()
@Controller('meditation')
export class MeditationController {
  constructor(private readonly proxy: MeditationUsecasesProxyService) {}
  @Get('logs')
  @ApiOperation({ summary: 'Get meditation logs' })
  @ApiOkResponse({ type: [MeditationLogResponseDto] })
  logs(
    @CurrentUser() user: UserModel,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return MeditationResponseMapper.toDto(this.proxy.logs(user.id, from, to));
  }
  @Post('logs')
  @ApiOperation({ summary: 'Create meditation log' })
  @ApiBody({ type: CreateMeditationLogRequestDto })
  @ApiOkResponse({ type: MeditationLogResponseDto })
  create(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateMeditationLogRequestDto,
  ) {
    return MeditationResponseMapper.toDto(this.proxy.createLog(user.id, dto));
  }
  @Patch('logs/:id')
  @ApiOperation({ summary: 'Update meditation log' })
  @ApiBody({ type: UpdateMeditationLogRequestDto })
  @ApiOkResponse({ type: MeditationLogResponseDto })
  update(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateMeditationLogRequestDto,
  ) {
    return MeditationResponseMapper.toDto(
      this.proxy.updateLog(user.id, id, dto),
    );
  }
  @Delete('logs/:id')
  @ApiOperation({ summary: 'Delete meditation log' })
  @ApiOkResponse({ description: 'Deleted' })
  delete(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return MeditationResponseMapper.toDto(this.proxy.deleteLog(user.id, id));
  }
}
