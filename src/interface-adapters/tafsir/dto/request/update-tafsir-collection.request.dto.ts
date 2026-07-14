import { PartialType } from '@nestjs/swagger';
import { CreateTafsirCollectionRequestDto } from './create-tafsir-collection.request.dto';

export class UpdateTafsirCollectionRequestDto extends PartialType(
  CreateTafsirCollectionRequestDto,
) {}
