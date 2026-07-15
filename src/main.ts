import './common-utils/polyfills/node-crypto.polyfill';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createSwaggerConfig } from './infrastructure/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const globalPrefix = configService.get<string>('APP_GLOBAL_PREFIX', 'api');
  const swaggerPath = configService.get<string>('SWAGGER_PATH', 'api/docs');
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  const adminCorsOrigin = 'https://admin.qassidine.com';

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin:
      corsOrigin === '*'
        ? true
        : Array.from(
            new Set(
              [...corsOrigin.split(','), adminCorsOrigin].map((origin) =>
                origin.trim().replace(/\/$/, ''),
              ),
            ),
          ),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = createSwaggerConfig(
    configService.get<string>('SWAGGER_TITLE', 'Éducation Spirituelle API V1'),
    configService.get<string>(
      'SWAGGER_DESCRIPTION',
      'Backend API for spiritual education and purification mobile application',
    ),
    configService.get<string>('SWAGGER_VERSION', '1.0.0'),
  );
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(Number(configService.get<string>('APP_PORT', '3000')));
}
void bootstrap();
