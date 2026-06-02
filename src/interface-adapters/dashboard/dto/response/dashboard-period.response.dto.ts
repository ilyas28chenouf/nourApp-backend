import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}
