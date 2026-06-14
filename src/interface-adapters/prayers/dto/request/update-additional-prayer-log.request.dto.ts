import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { AdditionalPrayerTime } from '../../../../domain/prayers/enums/additional-prayer-time.enum';

export class UpdateAdditionalPrayerLogRequestDto {
  @ApiPropertyOptional({ example: '2026-06-14' })
  @IsOptional()
  @IsDateString()
  prayerDate?: string;

  @ApiPropertyOptional({ enum: AdditionalPrayerTime })
  @IsOptional()
  @IsEnum(AdditionalPrayerTime)
  prayerTime?: AdditionalPrayerTime;

  @ApiPropertyOptional({ minimum: 1, example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  rakaat?: number;
}
