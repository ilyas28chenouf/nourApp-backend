import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PrayerTimesProviderPort,
  PrayerTimesProviderRequest,
} from '../../../domain/prayers/ports/prayer-times-provider.port';
import { AppLoggerService } from '../../logger/app-logger.service';

@Injectable()
export class UmmahPrayerTimesClient implements Pick<
  PrayerTimesProviderPort,
  'fetchPrayerTimes'
> {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  async fetchPrayerTimes(
    request: PrayerTimesProviderRequest,
  ): Promise<Record<string, any>> {
    const url = new URL(
      'prayer-times',
      this.configService.get<string>(
        'UMMAH_API_BASE_URL',
        'https://ummahapi.com/api',
      ) + '/',
    );
    url.searchParams.set('lat', String(request.latitude));
    url.searchParams.set('lng', String(request.longitude));
    url.searchParams.set('date', request.date);
    url.searchParams.set('method', request.method);
    url.searchParams.set('madhab', request.madhab);
    url.searchParams.set('timezone', request.timezone);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`UmmahAPI returned ${response.status}`);
      }
      return (await response.json()) as Record<string, any>;
    } catch (error) {
      this.logger.error(
        'Unable to fetch prayer times from UmmahAPI',
        undefined,
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      throw error;
    }
  }
}
