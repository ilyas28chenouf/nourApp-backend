import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WomenPeriodLogResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() date: string;
  @ApiPropertyOptional() feeling?: string | null;
  @ApiProperty() quran: boolean;
  @ApiProperty() dhikr: boolean;
  @ApiProperty() doua: boolean;
  @ApiProperty() reading: boolean;
  @ApiProperty() sadaka: boolean;
  @ApiProperty() meditation: boolean;
  @ApiProperty() hadith: boolean;
  @ApiProperty() health: boolean;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
