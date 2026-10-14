import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SpiritualLevel } from '../../../../domain/progression/enums/spiritual-level.enum';

export class ProgressionResponseDto {
  @ApiProperty()
  totalHasanat: number;

  @ApiProperty({
    description: 'One-based index in the 150-level progression catalog',
    minimum: 1,
    maximum: 150,
  })
  currentLevelNumber: number;

  @ApiProperty({ example: 150 })
  totalVisibleLevels: number;

  @ApiProperty({
    description: 'Points earned inside the current 2,000-point step',
    minimum: 0,
    maximum: 2000,
  })
  currentPoints: number;

  @ApiProperty({
    description: 'Point target for each combined spiritual level',
    example: 2000,
  })
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

  @ApiProperty({
    description: 'Points earned inside the current 30,000-point main level',
  })
  mainLevelCurrentPoints: number;

  @ApiProperty({ example: 30000 })
  mainLevelTargetPoints: number;

  @ApiProperty()
  pointsToNextMainLevel: number;

  @ApiProperty()
  mainLevelProgressPercent: number;

  @ApiProperty({
    description: 'Whether the 300,000-point progression is complete',
  })
  isCompleted: boolean;

  @ApiProperty()
  currentStreakDays: number;

  @ApiProperty()
  longestStreakDays: number;

  @ApiProperty()
  badges: unknown[];

  @ApiProperty()
  recentPointEvents: unknown[];
}
