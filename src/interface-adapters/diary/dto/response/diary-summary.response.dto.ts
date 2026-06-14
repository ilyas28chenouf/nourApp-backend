import { ApiProperty } from '@nestjs/swagger';

class DiarySummaryByTypeDto {
  @ApiProperty() REFLEXION: number;
  @ApiProperty() NIYYAH: number;
  @ApiProperty() GRATITUDE: number;
}

class DiarySummaryTopTagDto {
  @ApiProperty() tag: string;
  @ApiProperty() count: number;
}

export class DiarySummaryResponseDto {
  @ApiProperty() userId: string;
  @ApiProperty() from: string;
  @ApiProperty() to: string;
  @ApiProperty() total: number;
  @ApiProperty({ type: DiarySummaryByTypeDto })
  byType: DiarySummaryByTypeDto;
  @ApiProperty({ type: Object })
  byFeeling: Record<string, number>;
  @ApiProperty({ type: [DiarySummaryTopTagDto] })
  topTags: DiarySummaryTopTagDto[];
}
