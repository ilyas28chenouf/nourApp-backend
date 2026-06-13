import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SpiritualLevel } from '../../../../domain/progression/enums/spiritual-level.enum';

export class ProgressionResponseDto {
  @ApiProperty()
  totalHasanat: number;

  @ApiProperty({ enum: SpiritualLevel })
  currentVisibleLevel: SpiritualLevel;

  @ApiProperty()
  currentVisibleLevelLabel: string;

  @ApiPropertyOptional({ enum: SpiritualLevel, nullable: true })
  nextVisibleLevel?: SpiritualLevel | null;

  @ApiProperty()
  pointsToNextLevel: number;

  @ApiProperty()
  progressToNextLevelPercent: number;

  @ApiProperty()
  currentStreakDays: number;

  @ApiProperty()
  longestStreakDays: number;

  @ApiProperty()
  badges: unknown[];

  @ApiProperty()
  recentPointEvents: unknown[];
}
