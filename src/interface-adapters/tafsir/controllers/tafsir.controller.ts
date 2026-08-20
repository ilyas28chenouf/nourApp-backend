import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TafsirUsecasesProxyService } from '../../../usecases-proxy/tafsir/tafsir-usecases-proxy.service';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { UserModel } from '../../../domain/users/model/user.model';
import {
  CreateTafsirProgressRequestDto,
  UpdateTafsirProgressRequestDto,
} from '../dto/request/tafsir-progress.request.dto';
import { TafsirProgressResponseDto } from '../dto/response/tafsir-progress.response.dto';
import {
  TafsirCollectionKeyParamDto,
  TafsirItemParamDto,
} from '../dto/request/tafsir-param.dto';
import { PublicTafsirItemsQueryDto } from '../dto/request/tafsir-query.dto';
import {
  TafsirCollectionResponseDto,
  TafsirCollectionsResponseDto,
  TafsirItemResponseDto,
  TafsirItemsResponseDto,
} from '../dto/response/tafsir-public.response.dto';
import { TafsirResponseMapper } from '../mappers/tafsir.response.mapper';

@ApiTags('Tafsir')
@ApiBearerAuth()
@ProtectedApi()
@Controller('tafsir')
export class TafsirController {
  constructor(private readonly proxy: TafsirUsecasesProxyService) {}

  @Get('progress')
  @ApiOperation({ summary: 'List current user Tafsir reading evidence' })
  @ApiOkResponse({ type: [TafsirProgressResponseDto] })
  progress(
    @CurrentUser() user: UserModel,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.proxy.listProgress(user.id, from, to);
  }

  @Post('progress')
  @ApiOperation({ summary: 'Record Tafsir ayah reading evidence' })
  @ApiOkResponse({ type: TafsirProgressResponseDto })
  createProgress(
    @CurrentUser() user: UserModel,
    @Body() dto: CreateTafsirProgressRequestDto,
  ) {
    return this.proxy.createProgress(user.id, dto);
  }

  @Patch('progress/:id')
  @ApiOperation({ summary: 'Update Tafsir reading evidence' })
  @ApiOkResponse({ type: TafsirProgressResponseDto })
  updateProgress(
    @CurrentUser() user: UserModel,
    @Param('id') id: string,
    @Body() dto: UpdateTafsirProgressRequestDto,
  ) {
    return this.proxy.updateProgress(user.id, id, dto);
  }

  @Get('collections')
  @ApiOperation({ summary: 'List active Tafsir collections' })
  @ApiOkResponse({ type: TafsirCollectionsResponseDto })
  async collections() {
    const result = await this.proxy.listPublicCollections({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    });
    return TafsirResponseMapper.collections(result);
  }

  @Get('collections/:key')
  @ApiOperation({ summary: 'Get an active Tafsir collection by key' })
  @ApiOkResponse({ type: TafsirCollectionResponseDto })
  @ApiNotFoundResponse({ description: 'Active Tafsir collection not found' })
  async collection(@Param() params: TafsirCollectionKeyParamDto) {
    const collection = await this.proxy.getPublicCollection(params.key);
    return TafsirResponseMapper.collectionDetail(collection);
  }

  @Get('collections/:key/items')
  @ApiOperation({ summary: 'List active Tafsir items in a collection' })
  @ApiOkResponse({ type: TafsirItemsResponseDto })
  async items(
    @Param() params: TafsirCollectionKeyParamDto,
    @Query() query: PublicTafsirItemsQueryDto,
  ) {
    const { collection, result } = await this.proxy.listPublicItems(
      params.key,
      query,
    );
    return TafsirResponseMapper.items(collection, result);
  }

  @Get('collections/:key/surah/:surahNumber/ayah/:ayahNumber')
  @ApiOperation({ summary: 'Get one active Tafsir entry by surah and ayah' })
  @ApiOkResponse({ type: TafsirItemResponseDto })
  @ApiNotFoundResponse({ description: 'Active Tafsir item not found' })
  async item(@Param() params: TafsirItemParamDto) {
    const { collection, item } = await this.proxy.getPublicItem(
      params.key,
      params.surahNumber,
      params.ayahNumber,
    );
    return TafsirResponseMapper.itemDetail(collection, item);
  }
}
