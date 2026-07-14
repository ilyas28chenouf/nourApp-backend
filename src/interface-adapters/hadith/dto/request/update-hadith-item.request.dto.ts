import { PartialType } from '@nestjs/swagger';
import { CreateHadithItemRequestDto } from './create-hadith-item.request.dto';

export class UpdateHadithItemRequestDto extends PartialType(
  CreateHadithItemRequestDto,
) {}
