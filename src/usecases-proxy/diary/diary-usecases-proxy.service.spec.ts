import { DiaryEntryType } from '../../domain/diary/enums/diary-entry-type.enum';
import { DiaryUsecasesProxyService } from './diary-usecases-proxy.service';

describe('DiaryUsecasesProxyService', () => {
  it('summarizes entries by type, feeling, and tags', async () => {
    const service = new DiaryUsecasesProxyService({
      getRepository: () => ({}),
    } as any);
    jest.spyOn(service, 'list').mockResolvedValue([
      {
        type: DiaryEntryType.GRATITUDE,
        feeling: 'calm',
        tags: ['family', 'sabr'],
      },
      {
        type: DiaryEntryType.GRATITUDE,
        feeling: 'calm',
        tags: ['family'],
      },
      {
        type: DiaryEntryType.NIYYAH,
        feeling: '',
        tags: ['sabr'],
      },
    ] as any);

    await expect(
      service.summary('user-1', '2026-06-01', '2026-06-14'),
    ).resolves.toEqual({
      userId: 'user-1',
      from: '2026-06-01',
      to: '2026-06-14',
      total: 3,
      byType: {
        REFLEXION: 0,
        NIYYAH: 1,
        GRATITUDE: 2,
      },
      byFeeling: { calm: 2 },
      topTags: [
        { tag: 'family', count: 2 },
        { tag: 'sabr', count: 2 },
      ],
    });
  });
});
