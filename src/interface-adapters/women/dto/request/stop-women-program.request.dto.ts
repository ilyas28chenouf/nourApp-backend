import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class StopWomenProgramRequestDto {
  @ApiProperty({ example: '2026-06-24' })
  @Matches(DATE_ONLY_REGEX, { message: 'endDate must be YYYY-MM-DD' })
  endDate: string;

  @ApiPropertyOptional({ example: 'period_ended' })
  @IsOptional()
  @IsString()
  reason?: string;
}
