import { BadGatewayException } from '@nestjs/common';
import { PrayerTimesProviderPort } from '../../domain/prayers/ports/prayer-times-provider.port';

export class GetPrayerMethodsUsecase {
  constructor(private readonly provider: PrayerTimesProviderPort) {}

  async execute() {
    try {
      const response = await this.provider.fetchPrayerMethods();
      const data = (response.data ?? response) as Record<string, any>;
      const methods = data.methods as Record<string, unknown> | undefined;
      if (!methods?.UOIF) return data;
      return {
        ...data,
        methods: {
          UOIF: methods.UOIF,
          ...Object.fromEntries(
            Object.entries(methods).filter(([key]) => key !== 'UOIF'),
          ),
        },
      };
    } catch {
      throw new BadGatewayException(
        'Unable to fetch prayer times from provider',
      );
    }
  }
}
