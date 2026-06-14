import { PartialType } from '@nestjs/swagger';
import { CreateWomenPeriodLogRequestDto } from './create-women-period-log.request.dto';

export class UpdateWomenPeriodLogRequestDto extends PartialType(
  CreateWomenPeriodLogRequestDto,
) {}
