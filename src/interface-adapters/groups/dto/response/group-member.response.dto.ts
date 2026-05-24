import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupMemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
