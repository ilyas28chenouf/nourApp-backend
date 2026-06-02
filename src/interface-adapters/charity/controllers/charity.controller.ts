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
import { CharityUsecasesProxyService } from '../../../usecases-proxy/charity/charity-usecases-proxy.service';
import { CreateCharityLogRequestDto } from '../dto/request/create-charity-log.request.dto';
import { UpdateCharityLogRequestDto } from '../dto/request/update-charity-log.request.dto';
import { CharityLogResponseDto } from '../dto/response/charity-log.response.dto';
import { CharityResponseMapper } from '../mappers/charity.response.mapper';
@ApiTags('Charity')
@ApiBearerAuth()
@ProtectedApi()
@Controller('charity')
export class CharityController {
  constructor(private readonly proxy: CharityUsecasesProxyService) {}
  @Get('logs')
  @ApiOperation({ summary: 'Get charity logs' })
  @ApiOkResponse({ type: [CharityLogResponseDto] })
  logs(
    @CurrentUser() user: UserModel,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return CharityResponseMapper.toDto(this.proxy.logs(user.id, from, to));
  }
  @Post('logs')
  @ApiOperation({ summary: 'Create charity log' })
  @ApiBody({ type: CreateCharityLogRequestDto })
  @ApiOkResponse({ type: CharityLogResponseDto })
  create(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateCharityLogRequestDto,
  ) {
    return CharityResponseMapper.toDto(this.proxy.createLog(user.id, dto));
  }
  @Patch('logs/:id')
  @ApiOperation({ summary: 'Update charity log' })
  @ApiBody({ type: UpdateCharityLogRequestDto })
  @ApiOkResponse({ type: CharityLogResponseDto })
  update(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateCharityLogRequestDto,
  ) {
    return CharityResponseMapper.toDto(this.proxy.updateLog(user.id, id, dto));
  }
  @Delete('logs/:id')
  @ApiOperation({ summary: 'Delete charity log' })
  @ApiOkResponse({ description: 'Deleted' })
  delete(@CurrentUser() user: UserModel, @Param('id') id: string) {
    return CharityResponseMapper.toDto(this.proxy.deleteLog(user.id, id));
  }
  @Get('summary')
  @ApiOperation({ summary: 'Get charity summary' })
  @ApiOkResponse({ description: 'Summary' })
  summary(@CurrentUser() user: UserModel, @Query('period') period: string) {
    return CharityResponseMapper.toDto(this.proxy.summary(user.id, period));
  }
}
