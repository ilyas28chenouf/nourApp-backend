import { Injectable } from '@nestjs/common';
import {
  PrayerTimesProviderPort,
  PrayerTimesProviderRequest,
} from '../../../domain/prayers/ports/prayer-times-provider.port';
import { UmmahPrayerMethodsClient } from './ummah-prayer-methods.client';
import { UmmahPrayerTimesClient } from './ummah-prayer-times.client';

@Injectable()
export class UmmahPrayersClient implements PrayerTimesProviderPort {
  constructor(
    private readonly timesClient: UmmahPrayerTimesClient,
    private readonly methodsClient: UmmahPrayerMethodsClient,
  ) {}

  fetchPrayerTimes(request: PrayerTimesProviderRequest) {
    return this.timesClient.fetchPrayerTimes(request);
  }

  fetchPrayerMethods() {
    return this.methodsClient.fetchPrayerMethods();
  }
}
