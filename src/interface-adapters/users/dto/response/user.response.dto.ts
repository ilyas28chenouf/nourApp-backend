import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AgeRange } from '../../../../domain/users/enums/age-range.enum';
import { UserGender } from '../../../../domain/users/enums/user-gender.enum';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firebaseUid: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional({ enum: AgeRange })
  ageRange?: AgeRange | string;

  @ApiPropertyOptional({ enum: UserGender })
  gender?: UserGender | string;

  @ApiPropertyOptional()
  avatarUrl?: string;

  @ApiPropertyOptional()
  provider?: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  language: string;

  @ApiPropertyOptional()
  timezone?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  latitude?: number | string;

  @ApiPropertyOptional()
  longitude?: number | string;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  lastLoginAt?: Date;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
