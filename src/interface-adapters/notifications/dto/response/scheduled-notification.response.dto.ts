import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScheduledNotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
