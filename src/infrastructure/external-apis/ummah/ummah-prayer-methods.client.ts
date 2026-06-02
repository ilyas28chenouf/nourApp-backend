import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrayerTimesProviderPort } from '../../../domain/prayers/ports/prayer-times-provider.port';
import { AppLoggerService } from '../../logger/app-logger.service';

@Injectable()
export class UmmahPrayerMethodsClient implements Pick<
  PrayerTimesProviderPort,
  'fetchPrayerMethods'
> {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  async fetchPrayerMethods(): Promise<Record<string, any>> {
    const url = new URL(
      'prayer-methods',
      this.configService.get<string>(
        'UMMAH_API_BASE_URL',
        'https://ummahapi.com/api',
      ) + '/',
    );

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`UmmahAPI returned ${response.status}`);
      }
      return (await response.json()) as Record<string, any>;
    } catch (error) {
      this.logger.error(
        'Unable to fetch prayer methods from UmmahAPI',
        undefined,
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      throw error;
    }
  }
}
