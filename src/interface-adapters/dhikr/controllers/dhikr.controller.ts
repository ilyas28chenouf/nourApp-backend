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
  async items(
    @Query('category') category?: string,
    @Query('period') period?: any,
  ) {
    return DhikrResponseMapper.toDto(
      await this.proxy.items({ category, period }),
    );
  }
  @Get('categories')
  @ApiOperation({ summary: 'Get dhikr categories' })
  @ApiOkResponse({ description: 'Dhikr categories' })
  async categories() {
    return DhikrResponseMapper.toDto(await this.proxy.categories());
  }
  @Get('categories/:slug/items')
  @ApiOperation({ summary: 'Get dhikr items by category slug' })
  @ApiOkResponse({ type: [DhikrItemResponseDto] })
  async itemsByCategory(@Param('slug') slug: string) {
    return DhikrResponseMapper.toDto(
      await this.proxy.itemsByCategorySlug(slug),
    );
  }
  @Get('logs')
  @ApiOperation({ summary: 'Get dhikr logs' })
  @ApiOkResponse({ type: [DhikrLogResponseDto] })
  async logs(@CurrentUser() user: UserModel, @Query('date') date?: string) {
    return DhikrResponseMapper.toDto(await this.proxy.logs(user.id, date));
  }
  @Post('logs')
  @ApiOperation({ summary: 'Create dhikr log' })
  @ApiBody({ type: CreateDhikrLogRequestDto })
  @ApiOkResponse({ type: DhikrLogResponseDto })
  async create(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateDhikrLogRequestDto,
  ) {
    return DhikrResponseMapper.toDto(await this.proxy.createLog(user.id, dto));
  }
  @Patch('logs/:id')
  @ApiOperation({ summary: 'Update dhikr log' })
  @ApiBody({ type: UpdateDhikrLogRequestDto })
  @ApiOkResponse({ type: DhikrLogResponseDto })
  async update(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateDhikrLogRequestDto,
  ) {
    return DhikrResponseMapper.toDto(
      await this.proxy.updateLog(user.id, id, dto),
    );
  }
}
