import { PartialType } from '@nestjs/swagger';
import { CreateTafsirItemRequestDto } from './create-tafsir-item.request.dto';

export class UpdateTafsirItemRequestDto extends PartialType(
  CreateTafsirItemRequestDto,
) {}
