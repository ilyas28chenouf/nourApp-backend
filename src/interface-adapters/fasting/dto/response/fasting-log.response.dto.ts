import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FastingLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
