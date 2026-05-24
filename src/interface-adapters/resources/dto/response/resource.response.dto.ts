import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResourceResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
