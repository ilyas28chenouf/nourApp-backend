import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HadithUsecasesProxyService } from '../../../usecases-proxy/hadith/hadith-usecases-proxy.service';
import {
  HadithCollectionResponseDto,
  HadithCollectionsResponseDto,
  HadithItemResponseDto,
  HadithItemsResponseDto,
} from '../dto/response/hadith-public.response.dto';
import {
  HadithCollectionKeyParamDto,
  HadithItemParamDto,
} from '../dto/request/hadith-param.dto';
import { PublicHadithItemsQueryDto } from '../dto/request/hadith-query.dto';
import { HadithResponseMapper } from '../mappers/hadith.response.mapper';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';

@ApiTags('Hadith')
@ApiBearerAuth()
@ProtectedApi()
@Controller('hadith')
export class HadithController {
  constructor(private readonly proxy: HadithUsecasesProxyService) {}

  @Get('collections')
  @ApiOperation({ summary: 'List active Hadith collections' })
  @ApiOkResponse({ type: HadithCollectionsResponseDto })
  async collections() {
    const result = await this.proxy.listPublicCollections({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    });
    return HadithResponseMapper.collections(result);
  }

  @Get('collections/:key')
  @ApiOperation({ summary: 'Get an active Hadith collection by key' })
  @ApiOkResponse({ type: HadithCollectionResponseDto })
  @ApiNotFoundResponse({ description: 'Active Hadith collection not found' })
  async collection(@Param() params: HadithCollectionKeyParamDto) {
    const collection = await this.proxy.getPublicCollection(params.key);
    return HadithResponseMapper.collectionDetail(collection);
  }

  @Get('collections/:key/items')
  @ApiOperation({ summary: 'List active Hadith items in a collection' })
  @ApiOkResponse({ type: HadithItemsResponseDto })
  async items(
    @Param() params: HadithCollectionKeyParamDto,
    @Query() query: PublicHadithItemsQueryDto,
  ) {
    const { collection, result } = await this.proxy.listPublicItems(
      params.key,
      query,
    );
    return HadithResponseMapper.items(collection, result);
  }

  @Get('collections/:key/items/:hadithNumber')
  @ApiOperation({ summary: 'Get one active Hadith item by number' })
  @ApiOkResponse({ type: HadithItemResponseDto })
  @ApiNotFoundResponse({ description: 'Active Hadith item not found' })
  async item(@Param() params: HadithItemParamDto) {
    const { collection, item } = await this.proxy.getPublicItem(
      params.key,
      params.hadithNumber,
    );
    return HadithResponseMapper.itemDetail(collection, item);
  }
}
