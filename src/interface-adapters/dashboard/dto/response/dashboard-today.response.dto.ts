import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardTodayResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  period: string;

  @ApiProperty()
  generatedAt: Date;
}
