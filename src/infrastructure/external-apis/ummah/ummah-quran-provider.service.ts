import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UmmahQuranProviderService {
  private readonly baseUrl: string;
  private readonly cache = new Map<
    string,
    { expiresAt: number; data: unknown }
  >();

  constructor(config: ConfigService) {
    this.baseUrl = config.get<string>(
      'UMMAH_API_BASE_URL',
      'https://ummahapi.com',
    );
  }

  getSurahs(query: Record<string, string | undefined>) {
    return this.get('/quran/surahs', query);
  }
  getSurah(number: string, query: Record<string, string | undefined>) {
    return this.get(`/quran/surah/${number}`, query);
  }
  getAyah(
    surah: string,
    ayah: string,
    query: Record<string, string | undefined>,
  ) {
    return this.get(`/quran/surah/${surah}/ayah/${ayah}`, query);
  }
  search(query: Record<string, string | undefined>) {
    return this.get('/quran/search', query);
  }
  getJuz(number: string, query: Record<string, string | undefined>) {
    return this.get(`/quran/juz/${number}`, query);
  }
  getPage(number: string, query: Record<string, string | undefined>) {
    return this.get(`/quran/page/${number}`, query);
  }
  getReciters() {
    return this.get('/quran/reciters', {});
  }
  getAudio(
    surah: string,
    ayah: string | undefined,
    query: Record<string, string | undefined>,
  ) {
    return this.get(
      ayah ? `/quran/audio/${surah}/${ayah}` : `/quran/audio/${surah}`,
      query,
    );
  }

  private async get(path: string, query: Record<string, string | undefined>) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) search.set(key, value);
    }
    const url = `${this.baseUrl}${path}${search.size ? `?${search.toString()}` : ''}`;
    const cached = this.cache.get(url);
    if (cached && cached.expiresAt > Date.now()) return cached.data;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ummah API returned ${response.status}`);
      }
      const data = await response.json();
      this.cache.set(url, { data, expiresAt: Date.now() + 1000 * 60 * 15 });
      return data;
    } catch (error) {
      throw new BadGatewayException({
        message: 'Unable to fetch Quran content from provider',
        provider: 'Ummah API',
      });
    }
  }
}
