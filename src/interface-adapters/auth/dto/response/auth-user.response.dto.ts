import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserGender } from '../../../../domain/users/enums/user-gender.enum';

export class AuthUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firebaseUid: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  language: string;

  @ApiPropertyOptional()
  ageRange?: string;

  @ApiPropertyOptional({ enum: UserGender })
  gender?: UserGender | string;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  lastLoginAt?: Date;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
