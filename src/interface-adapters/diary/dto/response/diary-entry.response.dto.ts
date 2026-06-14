import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiaryEntryType } from '../../../../domain/diary/enums/diary-entry-type.enum';

export class DiaryEntryResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() entryDate: string;
  @ApiProperty({ enum: DiaryEntryType }) type: DiaryEntryType;
  @ApiPropertyOptional() feeling?: string | null;
  @ApiPropertyOptional() title?: string | null;
  @ApiProperty() description: string;
  @ApiProperty({ type: [String] }) tags: string[];
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
