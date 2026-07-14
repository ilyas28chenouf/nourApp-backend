import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '../../../domain/users/enums/user-role.enum';
import { TafsirUsecasesProxyService } from '../../../usecases-proxy/tafsir/tafsir-usecases-proxy.service';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CreateTafsirCollectionRequestDto } from '../../tafsir/dto/request/create-tafsir-collection.request.dto';
import { CreateTafsirItemRequestDto } from '../../tafsir/dto/request/create-tafsir-item.request.dto';
import {
  AdminTafsirCollectionsQueryDto,
  AdminTafsirItemsQueryDto,
} from '../../tafsir/dto/request/tafsir-query.dto';
import { UpdateTafsirCollectionRequestDto } from '../../tafsir/dto/request/update-tafsir-collection.request.dto';
import { UpdateTafsirItemRequestDto } from '../../tafsir/dto/request/update-tafsir-item.request.dto';

const conflictExample = {
  statusCode: 409,
  message: 'Tafsir collection key already exists',
  error: 'Conflict',
};

const collectionResponseExample = {
  id: 'c3139fa9-fe15-4a06-b788-a67d4e91dac3',
  key: 'ibn-kathir',
  name: 'Tafsir Ibn Kathir',
  arabicName: 'تفسير ابن كثير',
  author: 'Ibn Kathir',
  language: 'ar',
  sortOrder: 1,
  isActive: true,
  createdAt: '2026-07-14T12:00:00.000Z',
  updatedAt: '2026-07-14T12:00:00.000Z',
};

const itemResponseExample = {
  id: 'e43d3baa-91b3-4cc4-969c-5a72a210011a',
  collectionId: 'c3139fa9-fe15-4a06-b788-a67d4e91dac3',
  surahNumber: 1,
  ayahNumber: 1,
  surahName: 'Al-Fatiha',
  content: 'Verified commentary text for this ayah.',
  sourceReference: 'Volume 1, page 25',
  isActive: true,
};

@ApiTags('Admin Tafsir')
@ApiBearerAuth()
@ProtectedApi()
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
@Controller('admin/tafsir')
export class AdminTafsirController {
  constructor(private readonly proxy: TafsirUsecasesProxyService) {}

  @Get('collections')
  @ApiOperation({ summary: 'List Tafsir collections for administration' })
  @ApiOkResponse({
    description: 'Paginated collections with database item totals',
    schema: {
      example: {
        items: [
          {
            id: 'c3139fa9-fe15-4a06-b788-a67d4e91dac3',
            key: 'ibn-kathir',
            name: 'Tafsir Ibn Kathir',
            author: 'Ibn Kathir',
            language: 'ar',
            totalTafsirs: 20,
            isActive: true,
          },
        ],
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    },
  })
  listCollections(@Query() query: AdminTafsirCollectionsQueryDto) {
    return this.proxy.listCollections(query);
  }

  @Post('collections')
  @ApiOperation({ summary: 'Create a Tafsir collection' })
  @ApiCreatedResponse({
    description: 'Tafsir collection created',
    schema: { example: collectionResponseExample },
  })
  @ApiBadRequestResponse({ description: 'Invalid collection payload' })
  @ApiConflictResponse({ schema: { example: conflictExample } })
  createCollection(@Body() dto: CreateTafsirCollectionRequestDto) {
    return this.proxy.createCollection(dto);
  }

  @Get('collections/:id')
  @ApiOperation({ summary: 'Get a Tafsir collection by internal UUID' })
  @ApiOkResponse({ description: 'Tafsir collection with item total' })
  @ApiNotFoundResponse({ description: 'Tafsir collection not found' })
  getCollection(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.proxy.getCollection(id);
  }

  @Patch('collections/:id')
  @ApiOperation({ summary: 'Update a Tafsir collection' })
  @ApiOkResponse({ description: 'Tafsir collection updated' })
  @ApiConflictResponse({ schema: { example: conflictExample } })
  updateCollection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTafsirCollectionRequestDto,
  ) {
    return this.proxy.updateCollection(id, dto);
  }

  @Delete('collections/:id')
  @ApiOperation({ summary: 'Delete an empty Tafsir collection' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  @ApiConflictResponse({
    schema: {
      example: {
        statusCode: 409,
        message:
          'Cannot delete a Tafsir collection that contains items. Deactivate it or delete its items first.',
        error: 'Conflict',
      },
    },
  })
  deleteCollection(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.proxy.deleteCollection(id);
  }

  @Get('collections/:collectionId/items')
  @ApiOperation({ summary: 'List Tafsir items in a collection' })
  @ApiOkResponse({
    description: 'Paginated Tafsir items',
    schema: {
      example: {
        items: [
          {
            id: 'e43d3baa-91b3-4cc4-969c-5a72a210011a',
            collectionId: 'c3139fa9-fe15-4a06-b788-a67d4e91dac3',
            surahNumber: 1,
            ayahNumber: 1,
            content: 'Verified commentary text for this ayah.',
            isActive: true,
          },
        ],
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    },
  })
  listItems(
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Query() query: AdminTafsirItemsQueryDto,
  ) {
    return this.proxy.listItems(collectionId, query);
  }

  @Post('collections/:collectionId/items')
  @ApiOperation({
    summary: 'Create a Tafsir item using the collection UUID from the route',
  })
  @ApiCreatedResponse({
    description: 'Tafsir item created',
    schema: { example: itemResponseExample },
  })
  @ApiConflictResponse({
    schema: {
      example: {
        statusCode: 409,
        message:
          'Tafsir entry already exists for this collection, surah and ayah',
        error: 'Conflict',
      },
    },
  })
  createItem(
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Body() dto: CreateTafsirItemRequestDto,
  ) {
    return this.proxy.createItem(collectionId, dto);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get a Tafsir item by internal UUID' })
  @ApiOkResponse({ description: 'Tafsir item' })
  @ApiNotFoundResponse({ description: 'Tafsir item not found' })
  getItem(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.proxy.getItem(id);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update a Tafsir item' })
  @ApiOkResponse({ description: 'Tafsir item updated' })
  @ApiConflictResponse({ description: 'Tafsir location already exists' })
  updateItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTafsirItemRequestDto,
  ) {
    return this.proxy.updateItem(id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete a Tafsir item' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  deleteItem(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.proxy.deleteItem(id);
  }
}
