import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuranReadingLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
