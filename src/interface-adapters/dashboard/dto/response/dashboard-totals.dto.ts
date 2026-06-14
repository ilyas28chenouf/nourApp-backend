import { ApiProperty } from '@nestjs/swagger';

export class DashboardTotalsDto {
  @ApiProperty()
  prayersTotal: number;

  @ApiProperty()
  dhikrsTotal: number;

  @ApiProperty()
  fastingsTotal: number;

  @ApiProperty()
  quranPagesTotal: number;
}
