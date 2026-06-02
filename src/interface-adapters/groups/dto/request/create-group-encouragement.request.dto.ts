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
export class CreateGroupEncouragementRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() receiverUserId?: string;
  @ApiProperty() @IsString() message: string;
}
