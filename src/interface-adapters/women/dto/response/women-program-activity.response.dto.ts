import { ApiProperty } from '@nestjs/swagger';
import { WomenProgramActivityKey } from '../../../../domain/women/enums/women-program-activity-key.enum';

export class WomenProgramActivityResponseDto {
  @ApiProperty({ example: '2026-06-19' })
  date: string;

  @ApiProperty()
  programDay: number;

  @ApiProperty({ enum: WomenProgramActivityKey })
  activityKey: WomenProgramActivityKey;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  activitiesCompleted: number;

  @ApiProperty()
  activitiesTotal: number;
}
