import { WomenUsecasesProxyService } from './women-usecases-proxy.service';

describe('WomenUsecasesProxyService', () => {
  it('summarizes period log boolean totals', async () => {
    const service = new WomenUsecasesProxyService({
      getRepository: () => ({}),
    } as any);
    jest.spyOn(service, 'list').mockResolvedValue([
      { quran: true, dhikr: true, doua: false, reading: true },
      { quran: false, dhikr: true, doua: true, health: true },
    ] as any);

    await expect(
      service.summary('user-1', '2026-06-01', '2026-06-14'),
    ).resolves.toEqual({
      userId: 'user-1',
      from: '2026-06-01',
      to: '2026-06-14',
      totalDays: 2,
      totals: {
        quran: 1,
        dhikr: 2,
        doua: 1,
        reading: 1,
        sadaka: 0,
        meditation: 0,
        hadith: 0,
        health: 1,
      },
    });
  });
});
