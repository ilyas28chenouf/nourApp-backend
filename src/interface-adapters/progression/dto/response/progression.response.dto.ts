import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SpiritualLevel } from '../../../../domain/progression/enums/spiritual-level.enum';

export class ProgressionResponseDto {
  @ApiProperty()
  totalHasanat: number;

  @ApiProperty({
    description: 'One-based index in the existing six-level model',
  })
  currentLevelNumber: number;

  @ApiProperty({ example: 6 })
  totalVisibleLevels: number;

  @ApiProperty()
  currentPoints: number;

  @ApiProperty()
  targetPoints: number;

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
