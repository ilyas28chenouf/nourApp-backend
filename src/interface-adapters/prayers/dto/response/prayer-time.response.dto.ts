import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrayerTimeResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
