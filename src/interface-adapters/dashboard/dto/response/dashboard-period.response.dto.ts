import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardPeriodResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
