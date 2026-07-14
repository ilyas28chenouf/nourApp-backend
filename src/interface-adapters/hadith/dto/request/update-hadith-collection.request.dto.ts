import { PartialType } from '@nestjs/swagger';
import { CreateHadithCollectionRequestDto } from './create-hadith-collection.request.dto';

export class UpdateHadithCollectionRequestDto extends PartialType(
  CreateHadithCollectionRequestDto,
) {}
