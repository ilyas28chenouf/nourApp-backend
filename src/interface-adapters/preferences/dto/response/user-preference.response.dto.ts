import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserPreferenceResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
