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
import { DhikrUsecasesProxyService } from '../../../usecases-proxy/dhikr/dhikr-usecases-proxy.service';
import { CreateDhikrLogRequestDto } from '../dto/request/create-dhikr-log.request.dto';
import { UpdateDhikrLogRequestDto } from '../dto/request/update-dhikr-log.request.dto';
import { DhikrItemResponseDto } from '../dto/response/dhikr-item.response.dto';
import { DhikrLogResponseDto } from '../dto/response/dhikr-log.response.dto';
import { DhikrResponseMapper } from '../mappers/dhikr.response.mapper';
@ApiTags('Dhikr')
@ApiBearerAuth()
@ProtectedApi()
@Controller('dhikr')
export class DhikrController {
  constructor(private readonly proxy: DhikrUsecasesProxyService) {}
  @Get('items')
  @ApiOperation({ summary: 'Get dhikr items' })
  @ApiOkResponse({ type: [DhikrItemResponseDto] })
  items() {
    return DhikrResponseMapper.toDto(this.proxy.items());
  }
  @Get('logs')
  @ApiOperation({ summary: 'Get dhikr logs' })
  @ApiOkResponse({ type: [DhikrLogResponseDto] })
  logs(@CurrentUser() user: UserModel, @Query('date') date?: string) {
    return DhikrResponseMapper.toDto(this.proxy.logs(user.id, date));
  }
  @Post('logs')
  @ApiOperation({ summary: 'Create dhikr log' })
  @ApiBody({ type: CreateDhikrLogRequestDto })
  @ApiOkResponse({ type: DhikrLogResponseDto })
  create(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateDhikrLogRequestDto,
  ) {
    return DhikrResponseMapper.toDto(this.proxy.createLog(user.id, dto));
  }
  @Patch('logs/:id')
  @ApiOperation({ summary: 'Update dhikr log' })
  @ApiBody({ type: UpdateDhikrLogRequestDto })
  @ApiOkResponse({ type: DhikrLogResponseDto })
  update(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateDhikrLogRequestDto,
  ) {
    return DhikrResponseMapper.toDto(this.proxy.updateLog(user.id, id, dto));
  }
}
