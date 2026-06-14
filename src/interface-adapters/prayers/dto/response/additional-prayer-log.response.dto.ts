import { ApiProperty } from '@nestjs/swagger';
import { AdditionalPrayerTime } from '../../../../domain/prayers/enums/additional-prayer-time.enum';

export class AdditionalPrayerLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  prayerDate: string;

  @ApiProperty({ enum: AdditionalPrayerTime })
  prayerTime: AdditionalPrayerTime;

  @ApiProperty()
  rakaat: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
