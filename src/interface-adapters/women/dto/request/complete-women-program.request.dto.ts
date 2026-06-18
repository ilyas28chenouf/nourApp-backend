import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class CompleteWomenProgramRequestDto {
  @ApiProperty({ example: '2026-06-25' })
  @Matches(DATE_ONLY_REGEX, { message: 'endDate must be YYYY-MM-DD' })
  endDate: string;
}
