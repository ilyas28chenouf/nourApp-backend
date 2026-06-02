import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FastingRecommendedDayResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  date: string;

  @ApiPropertyOptional()
  hijriDate?: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  createdAt?: Date;
}
