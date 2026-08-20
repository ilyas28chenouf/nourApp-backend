import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResourceResponseDto } from './resource.response.dto';

export class DailyResourcesResponseDto {
  @ApiProperty()
  date: string;

  @ApiPropertyOptional({ type: ResourceResponseDto, nullable: true })
  verseOfTheDay: ResourceResponseDto | null;

  @ApiPropertyOptional({ type: ResourceResponseDto, nullable: true })
  hadithOfTheDay: ResourceResponseDto | null;

  @ApiPropertyOptional({ type: ResourceResponseDto, nullable: true })
  wisdomOfTheDay: ResourceResponseDto | null;
}
