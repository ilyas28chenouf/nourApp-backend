import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DashboardTotalsDto } from './dashboard-totals.dto';

export class DashboardPeriodResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  period: string;

  @ApiPropertyOptional()
  from?: string;

  @ApiPropertyOptional()
  to?: string;

  @ApiProperty()
  generatedAt: Date;

  @ApiProperty({ type: DashboardTotalsDto })
  totals: DashboardTotalsDto;
}
