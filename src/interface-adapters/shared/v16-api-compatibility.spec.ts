import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AsmaAlHusnaUsecasesProxyService } from '../../usecases-proxy/asma-al-husna/asma-al-husna-usecases-proxy.service';
import { CharityUsecasesProxyService } from '../../usecases-proxy/charity/charity-usecases-proxy.service';
import { DhikrUsecasesProxyService } from '../../usecases-proxy/dhikr/dhikr-usecases-proxy.service';
import { FastingUsecasesProxyService } from '../../usecases-proxy/fasting/fasting-usecases-proxy.service';
import { GoalsUsecasesProxyService } from '../../usecases-proxy/goals/goals-usecases-proxy.service';
import { HadithUsecasesProxyService } from '../../usecases-proxy/hadith/hadith-usecases-proxy.service';
import { NotificationsUsecasesProxyService } from '../../usecases-proxy/notifications/notifications-usecases-proxy.service';
import { PrayersUsecasesProxyService } from '../../usecases-proxy/prayers/prayers-usecases-proxy.service';
import { PreferencesUsecasesProxyService } from '../../usecases-proxy/preferences/preferences-usecases-proxy.service';
import { ProgressionService } from '../../usecases-proxy/progression/progression.service';
import { QuranUsecasesProxyService } from '../../usecases-proxy/quran/quran-usecases-proxy.service';
import { ResourcesUsecasesProxyService } from '../../usecases-proxy/resources/resources-usecases-proxy.service';
import { TafsirUsecasesProxyService } from '../../usecases-proxy/tafsir/tafsir-usecases-proxy.service';
import { AsmaAlHusnaController } from '../asma-al-husna/controllers/asma-al-husna.controller';
import { CharityController } from '../charity/controllers/charity.controller';
import { DhikrController } from '../dhikr/controllers/dhikr.controller';
import { FastingController } from '../fasting/controllers/fasting.controller';
import { GoalsController } from '../goals/controllers/goals.controller';
import { HadithController } from '../hadith/controllers/hadith.controller';
import { NotificationsController } from '../notifications/controllers/notifications.controller';
import { PrayersController } from '../prayers/controllers/prayers.controller';
import { ProgressionController } from '../progression/controllers/progression.controller';
import { QuranController } from '../quran/controllers/quran.controller';
import { ResourcesController } from '../resources/controllers/resources.controller';
import { TafsirController } from '../tafsir/controllers/tafsir.controller';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { RolesGuard } from './guards/roles.guard';

describe('v1.6 API compatibility and Swagger', () => {
  let app: INestApplication;
  let document: OpenAPIObject;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [
        AsmaAlHusnaController,
        CharityController,
        DhikrController,
        FastingController,
        GoalsController,
        HadithController,
        NotificationsController,
        PrayersController,
        ProgressionController,
        QuranController,
        ResourcesController,
        TafsirController,
      ],
      providers: [
        AsmaAlHusnaUsecasesProxyService,
        CharityUsecasesProxyService,
        DhikrUsecasesProxyService,
        FastingUsecasesProxyService,
        GoalsUsecasesProxyService,
        HadithUsecasesProxyService,
        NotificationsUsecasesProxyService,
        PrayersUsecasesProxyService,
        PreferencesUsecasesProxyService,
        ProgressionService,
        QuranUsecasesProxyService,
        ResourcesUsecasesProxyService,
        TafsirUsecasesProxyService,
      ].map((provide) => ({ provide, useValue: {} })),
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
      new DocumentBuilder().setTitle('v1.6 compatibility').build(),
    );
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it.each([
    '/api/goals',
    '/api/goals/{id}/progress',
    '/api/quran/goals',
    '/api/charity/logs',
    '/api/notifications/preferences',
    '/api/resources/daily',
    '/api/fasting/summary',
    '/api/quran/summary',
    '/api/tafsir/collections',
    '/api/hadith/collections',
    '/api/progression/me',
  ])('preserves %s', (path) => {
    expect(document.paths).toHaveProperty(path);
  });

  it.each([
    '/api/goals/catalog',
    '/api/goals/analytics',
    '/api/asma-al-husna',
    '/api/asma-al-husna/{number}',
    '/api/tafsir/progress',
    '/api/tafsir/progress/{id}',
  ])('documents justified v1.6 route %s', (path) => {
    expect(document.paths).toHaveProperty(path);
  });

  it('does not introduce an Activities API', () => {
    expect(Object.keys(document.paths)).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^\/api\/activities(?:\/|$)/),
      ]),
    );
  });

  it.each([
    ['PrayerLogResponseDto', 'prayedAtMosque'],
    ['DhikrLogResponseDto', 'dhikrItemId'],
    ['DhikrLogResponseDto', 'categoryId'],
    ['DhikrLogResponseDto', 'sessionType'],
    ['CharityLogResponseDto', 'actionType'],
    ['UserPreferenceResponseDto', 'activityNotificationsEnabled'],
    ['UserPreferenceResponseDto', 'mainIntentions'],
    ['FastingSummaryResponseDto', 'mondayThursday'],
    ['QuranSummaryResponseDto', 'readingPeriods'],
    ['DailyResourcesResponseDto', 'date'],
    ['ProgressionResponseDto', 'currentLevelNumber'],
  ])('documents %s.%s', (schemaName, property) => {
    expect(component(schemaName).properties).toHaveProperty(property);
  });

  it('types prayer methods instead of exposing unstructured objects', () => {
    const methods = component('PrayerMethodsResponseDto').properties?.methods;
    expect(methods).toMatchObject({
      type: 'object',
      additionalProperties: {
        $ref: '#/components/schemas/PrayerMethodDetailsResponseDto',
      },
    });
  });

  function component(name: string) {
    const schema = document.components?.schemas?.[name];
    if (!schema || '$ref' in schema) throw new Error(`Missing schema ${name}`);
    return schema;
  }
});
