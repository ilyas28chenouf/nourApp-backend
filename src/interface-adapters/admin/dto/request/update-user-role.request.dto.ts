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
import { UserRole } from '../../../../domain/users/enums/user-role.enum';
export class UpdateUserRoleRequestDto {
  @ApiProperty({ enum: UserRole }) @IsEnum(UserRole) role: UserRole;
}
