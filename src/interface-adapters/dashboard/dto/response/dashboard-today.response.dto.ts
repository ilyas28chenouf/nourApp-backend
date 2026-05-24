import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardTodayResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
