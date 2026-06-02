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
import { FastingStatus } from '../../../../domain/fasting/enums/fasting-status.enum';
import { FastingType } from '../../../../domain/fasting/enums/fasting-type.enum';
export class CreateFastingLogRequestDto {
  @ApiProperty() @IsDateString() fastingDate: string;
  @ApiProperty({ enum: FastingType })
  @IsEnum(FastingType)
  fastingType: FastingType;
  @ApiProperty({ enum: FastingStatus })
  @IsEnum(FastingStatus)
  status: FastingStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
