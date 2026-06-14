import { PartialType } from '@nestjs/swagger';
import { CreateDiaryEntryRequestDto } from './create-diary-entry.request.dto';

export class UpdateDiaryEntryRequestDto extends PartialType(
  CreateDiaryEntryRequestDto,
) {}
