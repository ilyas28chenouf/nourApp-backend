import { BadGatewayException } from '@nestjs/common';
import { PrayerTimesProviderPort } from '../../domain/prayers/ports/prayer-times-provider.port';

export class GetPrayerMethodsUsecase {
  constructor(private readonly provider: PrayerTimesProviderPort) {}

  async execute() {
    try {
      const response = await this.provider.fetchPrayerMethods();
      return response.data ?? response;
    } catch {
      throw new BadGatewayException(
        'Unable to fetch prayer times from provider',
      );
    }
  }
}
