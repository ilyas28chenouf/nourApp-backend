import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DashboardTotalsDto } from './dashboard-totals.dto';

export class DashboardTodayResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  period: string;

  @ApiProperty()
  generatedAt: Date;

  @ApiProperty({ type: DashboardTotalsDto })
  totals: DashboardTotalsDto;
}
