import { ApiProperty } from '@nestjs/swagger';

class WomenPeriodSummaryTotalsDto {
  @ApiProperty() quran: number;
  @ApiProperty() dhikr: number;
  @ApiProperty() doua: number;
  @ApiProperty() reading: number;
  @ApiProperty() sadaka: number;
  @ApiProperty() meditation: number;
  @ApiProperty() hadith: number;
  @ApiProperty() health: number;
}

export class WomenPeriodSummaryResponseDto {
  @ApiProperty() userId: string;
  @ApiProperty() from: string;
  @ApiProperty() to: string;
  @ApiProperty() totalDays: number;
  @ApiProperty({ type: WomenPeriodSummaryTotalsDto })
  totals: WomenPeriodSummaryTotalsDto;
}
