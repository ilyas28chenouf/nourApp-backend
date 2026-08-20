import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DhikrSessionType } from '../../../../domain/dhikr/enums/dhikr-session-type.enum';

export class DhikrLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  dhikrDate: string;

  @ApiProperty()
  period: string;

  @ApiPropertyOptional()
  dhikrItemId?: string;

  @ApiPropertyOptional()
  categoryId?: string;

  @ApiPropertyOptional({ enum: DhikrSessionType })
  sessionType?: DhikrSessionType;

  @ApiProperty()
  counter: number;

  @ApiProperty()
  completed: boolean;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
