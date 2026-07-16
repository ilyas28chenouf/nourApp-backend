import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HadithTypeormAdapter } from '../hadith/adapters/hadith-typeorm.adapter';
import { TafsirTypeormAdapter } from '../tafsir/adapters/tafsir-typeorm.adapter';

type QueryBuilderMock = Record<string, jest.Mock>;

describe('Hadith TypeORM pagination', () => {
  it('uses a metadata-only projection and limit+1 pagination for public items', async () => {
    const query = createQueryBuilderMock();
    query.getRawMany.mockResolvedValue(
      Array.from({ length: 11 }, (_, index) => ({
        hadithNumber: index + 1,
        grade: 'Sahih',
        narrator: 'Narrator',
        chapter: 'Chapter',
        sourceReference: 'Reference',
      })),
    );
    const adapter = new HadithTypeormAdapter(createDataSource(query));

    const result = await adapter.listPublicItems('collection-id', {
      page: '2' as unknown as number,
      limit: '10' as unknown as number,
      search: 'intentions',
      grade: 'Sahih',
      hadithNumber: 1,
    });

    expect(query.skip).toHaveBeenCalledWith(10);
    expect(query.take).toHaveBeenCalledWith(11);
    expect(query.getRawMany).toHaveBeenCalledTimes(1);
    expect(query.getManyAndCount).not.toHaveBeenCalled();
    const projection = JSON.stringify({
      select: query.select.mock.calls,
      addSelect: query.addSelect.mock.calls,
    });
    expect(projection).not.toContain('item.arabic');
    expect(projection).not.toContain('item.english');
    expect(projection).not.toContain('item.french');
    expect(result.items).toHaveLength(10);
    expect(result.items[0]).not.toHaveProperty('arabic');
    expect(query.andWhere).toHaveBeenCalledWith(
      expect.stringContaining('item.arabic ILIKE :search'),
      { search: '%intentions%' },
    );
    expect(query.andWhere).toHaveBeenCalledWith('item.grade ILIKE :grade', {
      grade: 'Sahih',
    });
    expect(query.andWhere).toHaveBeenCalledWith(
      'item.hadithNumber = :hadithNumber',
      { hadithNumber: 1 },
    );
    expect(result).toMatchObject({
      page: 2,
      limit: 10,
      hasNextPage: true,
    });
  });

  it('restores total and totalPages for admin items', async () => {
    const query = createQueryBuilderMock();
    query.getManyAndCount.mockResolvedValue([[], 45]);
    const adapter = new HadithTypeormAdapter(createDataSource(query));

    const result = await adapter.listItems('collection-id', {
      page: 2,
      limit: 10,
    });

    expect(query.skip).toHaveBeenCalledWith(10);
    expect(query.take).toHaveBeenCalledWith(10);
    expect(query.getManyAndCount).toHaveBeenCalledTimes(1);
    expect(query.getMany).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      page: 2,
      limit: 10,
      total: 45,
      totalPages: 5,
    });
  });

  it('rejects invalid pagination before skip/take or a database query', async () => {
    const query = createQueryBuilderMock();
    const adapter = new HadithTypeormAdapter(createDataSource(query));

    await expect(
      adapter.listPublicItems('collection-id', {
        page: Number.NaN,
        limit: 10,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(query.skip).not.toHaveBeenCalled();
    expect(query.take).not.toHaveBeenCalled();
    expect(query.getRawMany).not.toHaveBeenCalled();
    expect(query.getManyAndCount).not.toHaveBeenCalled();
  });
});

describe('Tafsir TypeORM pagination', () => {
  it('uses a metadata-only projection and limit+1 pagination for public items', async () => {
    const query = createQueryBuilderMock();
    query.getRawMany.mockResolvedValue(
      Array.from({ length: 11 }, (_, index) => ({
        surahNumber: 1,
        surahName: 'Al-Fatiha',
        ayahNumber: index + 1,
        title: null,
        sourceReference: null,
      })),
    );
    const adapter = new TafsirTypeormAdapter(createDataSource(query));

    const result = await adapter.listPublicItems('collection-id', {
      page: '2' as unknown as number,
      limit: '10' as unknown as number,
      search: 'mercy',
      surahNumber: 1,
      ayahNumber: 2,
    });

    expect(query.skip).toHaveBeenCalledWith(10);
    expect(query.take).toHaveBeenCalledWith(11);
    expect(query.select).toHaveBeenCalledWith(
      'item.surahNumber',
      'surahNumber',
    );
    expect(query.getRawMany).toHaveBeenCalledTimes(1);
    expect(query.getManyAndCount).not.toHaveBeenCalled();
    expect(
      JSON.stringify({
        select: query.select.mock.calls,
        addSelect: query.addSelect.mock.calls,
      }),
    ).not.toContain('item.content');
    expect(result.items).toHaveLength(10);
    expect(result.items[0]).not.toHaveProperty('content');
    expect(query.andWhere).toHaveBeenCalledWith(
      expect.stringContaining('item.content ILIKE :search'),
      { search: '%mercy%' },
    );
    expect(query.andWhere).toHaveBeenCalledWith(
      'item.surahNumber = :surahNumber',
      { surahNumber: 1 },
    );
    expect(query.andWhere).toHaveBeenCalledWith(
      'item.ayahNumber = :ayahNumber',
      { ayahNumber: 2 },
    );
    expect(result).toMatchObject({
      page: 2,
      limit: 10,
      hasNextPage: true,
    });
  });

  it('reports no next public page when the limit+1 row is absent', async () => {
    const query = createQueryBuilderMock();
    query.getRawMany.mockResolvedValue(
      Array.from({ length: 10 }, (_, index) => ({
        surahNumber: 1,
        ayahNumber: index + 1,
      })),
    );
    const adapter = new TafsirTypeormAdapter(createDataSource(query));

    const result = await adapter.listPublicItems('collection-id', {
      page: 1,
      limit: 10,
    });

    expect(result.items).toHaveLength(10);
    expect(result.hasNextPage).toBe(false);
  });

  it('restores total and totalPages for admin items', async () => {
    const query = createQueryBuilderMock();
    query.getManyAndCount.mockResolvedValue([[], 45]);
    const adapter = new TafsirTypeormAdapter(createDataSource(query));

    const result = await adapter.listItems('collection-id', {
      page: 2,
      limit: 10,
    });

    expect(query.skip).toHaveBeenCalledWith(10);
    expect(query.take).toHaveBeenCalledWith(10);
    expect(query.getManyAndCount).toHaveBeenCalledTimes(1);
    expect(query.getMany).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      page: 2,
      limit: 10,
      total: 45,
      totalPages: 5,
    });
  });

  it('rejects invalid pagination before skip/take or a database query', async () => {
    const query = createQueryBuilderMock();
    const adapter = new TafsirTypeormAdapter(createDataSource(query));

    await expect(
      adapter.listItems('collection-id', {
        page: 1,
        limit: Number.POSITIVE_INFINITY,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(query.skip).not.toHaveBeenCalled();
    expect(query.take).not.toHaveBeenCalled();
    expect(query.getMany).not.toHaveBeenCalled();
    expect(query.getManyAndCount).not.toHaveBeenCalled();
  });
});

function createQueryBuilderMock(): QueryBuilderMock {
  const query: QueryBuilderMock = {
    where: jest.fn(),
    andWhere: jest.fn(),
    orderBy: jest.fn(),
    addOrderBy: jest.fn(),
    skip: jest.fn(),
    take: jest.fn(),
    innerJoin: jest.fn(),
    select: jest.fn(),
    addSelect: jest.fn(),
    getMany: jest.fn().mockResolvedValue([]),
    getRawMany: jest.fn().mockResolvedValue([]),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  };

  for (const method of [
    'where',
    'andWhere',
    'orderBy',
    'addOrderBy',
    'skip',
    'take',
    'innerJoin',
    'select',
    'addSelect',
  ]) {
    query[method].mockReturnValue(query);
  }

  return query;
}

function createDataSource(query: QueryBuilderMock) {
  const itemRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(query),
  };
  const getRepository = jest
    .fn()
    .mockReturnValueOnce({})
    .mockReturnValueOnce(itemRepository);

  return { getRepository } as unknown as DataSource;
}
