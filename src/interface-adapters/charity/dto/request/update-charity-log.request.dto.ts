import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { CharityActionType } from '../../../../domain/charity/enums/charity-action-type.enum';
export class UpdateCharityLogRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsDateString() charityDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() amount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() frequencyType?: string;
  @ApiPropertyOptional({ enum: CharityActionType })
  @IsOptional()
  @IsEnum(CharityActionType)
  actionType?: CharityActionType;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}
