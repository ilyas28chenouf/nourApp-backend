import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CharityLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  charityDate: string;

  @ApiPropertyOptional()
  amount?: number;

  @ApiProperty()
  currency: string;

  @ApiPropertyOptional()
  frequencyType?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
