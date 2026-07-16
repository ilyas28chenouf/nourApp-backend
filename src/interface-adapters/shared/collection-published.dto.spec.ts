import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateHadithCollectionRequestDto } from '../hadith/dto/request/create-hadith-collection.request.dto';
import { UpdateHadithCollectionRequestDto } from '../hadith/dto/request/update-hadith-collection.request.dto';
import { CreateTafsirCollectionRequestDto } from '../tafsir/dto/request/create-tafsir-collection.request.dto';
import { UpdateTafsirCollectionRequestDto } from '../tafsir/dto/request/update-tafsir-collection.request.dto';

type PublishedDto = { published?: boolean };
type DtoClass = new () => PublishedDto;

const validationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true },
});

const createDtos: Array<[string, DtoClass, Record<string, unknown>]> = [
  [
    'CreateHadithCollectionRequestDto',
    CreateHadithCollectionRequestDto,
    {
      key: 'bukhari',
      name: 'Sahih al-Bukhari',
      arabicName: 'صحيح البخاري',
      author: 'Imam Bukhari',
    },
  ],
  [
    'CreateTafsirCollectionRequestDto',
    CreateTafsirCollectionRequestDto,
    {
      key: 'ibn-kathir',
      name: 'Tafsir Ibn Kathir',
      author: 'Ibn Kathir',
      language: 'ar',
    },
  ],
];

const updateDtos: Array<[string, DtoClass]> = [
  ['UpdateHadithCollectionRequestDto', UpdateHadithCollectionRequestDto],
  ['UpdateTafsirCollectionRequestDto', UpdateTafsirCollectionRequestDto],
];

describe('collection published request DTOs', () => {
  it.each(createDtos)(
    '%s accepts explicit true and false',
    async (_name, metatype, payload) => {
      const published = (await validate(
        metatype,
        { ...payload, published: true },
        'body',
      )) as PublishedDto;
      const unpublished = (await validate(
        metatype,
        { ...payload, published: false },
        'body',
      )) as PublishedDto;

      expect(published.published).toBe(true);
      expect(unpublished.published).toBe(false);
    },
  );

  it.each(createDtos)(
    '%s allows published to be omitted',
    async (_name, metatype, payload) => {
      const result = (await validate(
        metatype,
        payload,
        'body',
      )) as PublishedDto;
      expect(result.published).toBeUndefined();
    },
  );

  it.each(updateDtos)(
    '%s accepts false during PATCH',
    async (_name, metatype) => {
      const result = (await validate(
        metatype,
        { published: false },
        'body',
      )) as PublishedDto;
      expect(result.published).toBe(false);
    },
  );

  it.each([...createDtos, ...updateDtos])(
    '%s rejects non-boolean published values',
    async (_name, metatype, payload = {}) => {
      await expect(
        validate(metatype, { ...payload, published: 'false' }, 'body'),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );
});

function validate(
  metatype: DtoClass,
  value: Record<string, unknown>,
  type: 'body',
) {
  return validationPipe.transform(value, { type, metatype });
}
