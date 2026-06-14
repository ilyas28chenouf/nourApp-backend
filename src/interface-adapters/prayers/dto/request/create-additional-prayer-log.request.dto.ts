import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, Min } from 'class-validator';
import { AdditionalPrayerTime } from '../../../../domain/prayers/enums/additional-prayer-time.enum';

export class CreateAdditionalPrayerLogRequestDto {
  @ApiProperty({ example: '2026-06-14' })
  @IsDateString()
  prayerDate: string;

  @ApiProperty({ enum: AdditionalPrayerTime })
  @IsEnum(AdditionalPrayerTime)
  prayerTime: AdditionalPrayerTime;

  @ApiProperty({ minimum: 1, example: 2 })
  @IsInt()
  @Min(1)
  rakaat: number;
}
