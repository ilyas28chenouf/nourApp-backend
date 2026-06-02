import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScheduledNotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  scheduledAt: Date;

  @ApiPropertyOptional()
  sentAt?: Date;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
