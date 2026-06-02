import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupMemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  joinedAt?: Date;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
