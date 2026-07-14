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
import { HadithUsecasesProxyService } from '../../../usecases-proxy/hadith/hadith-usecases-proxy.service';
import { CreateHadithCollectionRequestDto } from '../../hadith/dto/request/create-hadith-collection.request.dto';
import { CreateHadithItemRequestDto } from '../../hadith/dto/request/create-hadith-item.request.dto';
import {
  AdminHadithCollectionsQueryDto,
  AdminHadithItemsQueryDto,
} from '../../hadith/dto/request/hadith-query.dto';
import { UpdateHadithCollectionRequestDto } from '../../hadith/dto/request/update-hadith-collection.request.dto';
import { UpdateHadithItemRequestDto } from '../../hadith/dto/request/update-hadith-item.request.dto';
import { ProtectedApi } from '../../shared/decorators/protected-api.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';

const conflictExample = {
  statusCode: 409,
  message: 'Hadith collection key already exists',
  error: 'Conflict',
};

const collectionResponseExample = {
  id: '98b1c08e-f642-42d0-8969-79ad0f822890',
  key: 'bukhari',
  name: 'Sahih al-Bukhari',
  arabicName: 'صحيح البخاري',
  author: 'Imam Bukhari',
  reliability: 'Sahih',
  sortOrder: 1,
  isActive: true,
  createdAt: '2026-07-14T12:00:00.000Z',
  updatedAt: '2026-07-14T12:00:00.000Z',
};

const itemResponseExample = {
  id: '3a22c38a-aaf4-48f5-a029-11aefaba4ad5',
  collectionId: '98b1c08e-f642-42d0-8969-79ad0f822890',
  hadithNumber: 1,
  arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
  english: 'Actions are judged by intentions.',
  grade: 'Sahih',
  isActive: true,
};

@ApiTags('Admin Hadith')
@ApiBearerAuth()
@ProtectedApi()
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
@Controller('admin/hadith')
export class AdminHadithController {
  constructor(private readonly proxy: HadithUsecasesProxyService) {}

  @Get('collections')
  @ApiOperation({ summary: 'List Hadith collections for administration' })
  @ApiOkResponse({
    description: 'Paginated collections with database item totals',
    schema: {
      example: {
        items: [
          {
            id: '98b1c08e-f642-42d0-8969-79ad0f822890',
            key: 'bukhari',
            name: 'Sahih al-Bukhari',
            arabicName: 'صحيح البخاري',
            author: 'Imam Bukhari',
            totalHadiths: 100,
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
  listCollections(@Query() query: AdminHadithCollectionsQueryDto) {
    return this.proxy.listCollections(query);
  }

  @Post('collections')
  @ApiOperation({ summary: 'Create a Hadith collection' })
  @ApiCreatedResponse({
    description: 'Hadith collection created',
    schema: { example: collectionResponseExample },
  })
  @ApiBadRequestResponse({ description: 'Invalid collection payload' })
  @ApiConflictResponse({ schema: { example: conflictExample } })
  createCollection(@Body() dto: CreateHadithCollectionRequestDto) {
    return this.proxy.createCollection(dto);
  }

  @Get('collections/:id')
  @ApiOperation({ summary: 'Get a Hadith collection by internal UUID' })
  @ApiOkResponse({ description: 'Hadith collection with item total' })
  @ApiNotFoundResponse({ description: 'Hadith collection not found' })
  getCollection(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.proxy.getCollection(id);
  }

  @Patch('collections/:id')
  @ApiOperation({ summary: 'Update a Hadith collection' })
  @ApiOkResponse({ description: 'Hadith collection updated' })
  @ApiConflictResponse({ schema: { example: conflictExample } })
  updateCollection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateHadithCollectionRequestDto,
  ) {
    return this.proxy.updateCollection(id, dto);
  }

  @Delete('collections/:id')
  @ApiOperation({ summary: 'Delete an empty Hadith collection' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  @ApiConflictResponse({
    schema: {
      example: {
        statusCode: 409,
        message:
          'Cannot delete a Hadith collection that contains items. Deactivate it or delete its items first.',
        error: 'Conflict',
      },
    },
  })
  deleteCollection(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.proxy.deleteCollection(id);
  }

  @Get('collections/:collectionId/items')
  @ApiOperation({ summary: 'List Hadith items in a collection' })
  @ApiOkResponse({
    description: 'Paginated Hadith items',
    schema: {
      example: {
        items: [
          {
            id: '3a22c38a-aaf4-48f5-a029-11aefaba4ad5',
            collectionId: '98b1c08e-f642-42d0-8969-79ad0f822890',
            hadithNumber: 1,
            arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
            grade: 'Sahih',
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
    @Query() query: AdminHadithItemsQueryDto,
  ) {
    return this.proxy.listItems(collectionId, query);
  }

  @Post('collections/:collectionId/items')
  @ApiOperation({
    summary: 'Create a Hadith item using the collection UUID from the route',
  })
  @ApiCreatedResponse({
    description: 'Hadith item created',
    schema: { example: itemResponseExample },
  })
  @ApiConflictResponse({
    schema: {
      example: {
        statusCode: 409,
        message: 'Hadith number already exists in this collection',
        error: 'Conflict',
      },
    },
  })
  createItem(
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Body() dto: CreateHadithItemRequestDto,
  ) {
    return this.proxy.createItem(collectionId, dto);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get a Hadith item by internal UUID' })
  @ApiOkResponse({ description: 'Hadith item' })
  @ApiNotFoundResponse({ description: 'Hadith item not found' })
  getItem(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.proxy.getItem(id);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update a Hadith item' })
  @ApiOkResponse({ description: 'Hadith item updated' })
  @ApiConflictResponse({ description: 'Hadith number already exists' })
  updateItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateHadithItemRequestDto,
  ) {
    return this.proxy.updateItem(id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete a Hadith item' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  deleteItem(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.proxy.deleteItem(id);
  }
}
