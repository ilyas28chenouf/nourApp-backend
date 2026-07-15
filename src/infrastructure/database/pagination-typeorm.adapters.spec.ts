import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HadithTypeormAdapter } from '../hadith/adapters/hadith-typeorm.adapter';
import { TafsirTypeormAdapter } from '../tafsir/adapters/tafsir-typeorm.adapter';

type QueryBuilderMock = Record<string, jest.Mock>;

describe('Hadith TypeORM pagination', () => {
  it('uses numeric page-2 offset and count-free pagination for public items', async () => {
    const query = createQueryBuilderMock();
    query.getMany.mockResolvedValue(Array.from({ length: 10 }, () => ({})));
    const adapter = new HadithTypeormAdapter(createDataSource(query));

    const result = await adapter.listItems(
      'collection-id',
      {
        page: '2' as unknown as number,
        limit: '10' as unknown as number,
      },
      true,
    );

    expect(query.skip).toHaveBeenCalledWith(10);
    expect(query.take).toHaveBeenCalledWith(10);
    expect(query.getMany).toHaveBeenCalledTimes(1);
    expect(query.getManyAndCount).not.toHaveBeenCalled();
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
      adapter.listItems('collection-id', { page: Number.NaN, limit: 10 }, true),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(query.skip).not.toHaveBeenCalled();
    expect(query.take).not.toHaveBeenCalled();
    expect(query.getMany).not.toHaveBeenCalled();
    expect(query.getManyAndCount).not.toHaveBeenCalled();
  });
});

describe('Tafsir TypeORM pagination', () => {
  it('uses numeric page-2 offset and count-free pagination for public items', async () => {
    const query = createQueryBuilderMock();
    query.getMany.mockResolvedValue(Array.from({ length: 10 }, () => ({})));
    const adapter = new TafsirTypeormAdapter(createDataSource(query));

    const result = await adapter.listItems(
      'collection-id',
      {
        page: '2' as unknown as number,
        limit: '10' as unknown as number,
      },
      true,
    );

    expect(query.skip).toHaveBeenCalledWith(10);
    expect(query.take).toHaveBeenCalledWith(10);
    expect(query.getMany).toHaveBeenCalledTimes(1);
    expect(query.getManyAndCount).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      page: 2,
      limit: 10,
      hasNextPage: true,
    });
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
      adapter.listItems(
        'collection-id',
        { page: 1, limit: Number.POSITIVE_INFINITY },
        true,
      ),
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
    getMany: jest.fn().mockResolvedValue([]),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  };

  for (const method of [
    'where',
    'andWhere',
    'orderBy',
    'addOrderBy',
    'skip',
    'take',
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
