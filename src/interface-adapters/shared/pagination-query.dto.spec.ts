import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AdminHadithController } from '../admin/controllers/admin-hadith.controller';
import { AdminTafsirController } from '../admin/controllers/admin-tafsir.controller';
import { HadithController } from '../hadith/controllers/hadith.controller';
import {
  AdminHadithCollectionsQueryDto,
  AdminHadithItemsQueryDto,
  PublicHadithItemsQueryDto,
} from '../hadith/dto/request/hadith-query.dto';
import { TafsirController } from '../tafsir/controllers/tafsir.controller';
import {
  AdminTafsirCollectionsQueryDto,
  AdminTafsirItemsQueryDto,
  PublicTafsirItemsQueryDto,
} from '../tafsir/dto/request/tafsir-query.dto';
import { HadithUsecasesProxyService } from '../../usecases-proxy/hadith/hadith-usecases-proxy.service';
import { TafsirUsecasesProxyService } from '../../usecases-proxy/tafsir/tafsir-usecases-proxy.service';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { RolesGuard } from './guards/roles.guard';

type PaginationDto = { page: number; limit: number };
type PaginationDtoClass = new () => PaginationDto;

const paginationDtos: Array<[string, PaginationDtoClass]> = [
  ['PublicHadithItemsQueryDto', PublicHadithItemsQueryDto],
  ['AdminHadithItemsQueryDto', AdminHadithItemsQueryDto],
  ['AdminHadithCollectionsQueryDto', AdminHadithCollectionsQueryDto],
  ['PublicTafsirItemsQueryDto', PublicTafsirItemsQueryDto],
  ['AdminTafsirItemsQueryDto', AdminTafsirItemsQueryDto],
  ['AdminTafsirCollectionsQueryDto', AdminTafsirCollectionsQueryDto],
];

describe('Tafsir and Hadith pagination query DTOs', () => {
  const validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: { enableImplicitConversion: true },
  });

  it.each(paginationDtos)(
    '%s transforms page and limit query strings into numbers',
    async (_name, metatype) => {
      const result = (await validationPipe.transform(
        { page: '2', limit: '10' },
        { type: 'query', metatype },
      )) as PaginationDto;

      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(typeof result.page).toBe('number');
      expect(typeof result.limit).toBe('number');
    },
  );

  it.each(['invalid', '0', '1.5', 'Infinity'])(
    'rejects invalid page value %s',
    async (page) => {
      await expect(
        validationPipe.transform(
          { page, limit: '10' },
          { type: 'query', metatype: PublicHadithItemsQueryDto },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );
});

describe('Tafsir and Hadith pagination OpenAPI schemas', () => {
  let app: INestApplication;
  let document: OpenAPIObject;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [
        HadithController,
        TafsirController,
        AdminHadithController,
        AdminTafsirController,
      ],
      providers: [
        { provide: HadithUsecasesProxyService, useValue: {} },
        { provide: TafsirUsecasesProxyService, useValue: {} },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Pagination test').build(),
    );
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  const operations: Array<[string, string]> = [
    ['/api/hadith/collections/{key}/items', 'PublicHadithItemsQueryDto'],
    ['/api/tafsir/collections/{key}/items', 'PublicTafsirItemsQueryDto'],
    [
      '/api/admin/hadith/collections/{collectionId}/items',
      'AdminHadithItemsQueryDto',
    ],
    [
      '/api/admin/tafsir/collections/{collectionId}/items',
      'AdminTafsirItemsQueryDto',
    ],
    ['/api/admin/hadith/collections', 'AdminHadithCollectionsQueryDto'],
    ['/api/admin/tafsir/collections', 'AdminTafsirCollectionsQueryDto'],
  ];

  it.each(operations)(
    '%s exposes integer page and limit parameters',
    (path) => {
      const pageSchema = querySchema(document, path, 'page');
      const limitSchema = querySchema(document, path, 'limit');

      expect(pageSchema).toEqual({
        type: 'integer',
        default: 1,
        minimum: 1,
      });
      expect(limitSchema).toEqual({
        type: 'integer',
        default: 10,
        minimum: 1,
        maximum: 100,
      });
      expect(JSON.stringify({ pageSchema, limitSchema })).not.toContain(
        '#/components/schemas/Object',
      );
    },
  );
});

function querySchema(
  document: OpenAPIObject,
  path: string,
  parameterName: string,
) {
  const parameters = document.paths[path]?.get?.parameters ?? [];
  const parameter = parameters.find(
    (candidate) => !('$ref' in candidate) && candidate.name === parameterName,
  );

  if (!parameter || '$ref' in parameter) {
    throw new Error(`Missing ${parameterName} query parameter for ${path}`);
  }

  return parameter.schema;
}
