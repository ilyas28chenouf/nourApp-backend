import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CharityActionType } from '../../../../domain/charity/enums/charity-action-type.enum';

export class CharityLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  charityDate: string;

  @ApiPropertyOptional()
  amount?: number;

  @ApiProperty()
  currency: string;

  @ApiPropertyOptional()
  frequencyType?: string;

  @ApiProperty({ enum: CharityActionType })
  actionType: CharityActionType;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
