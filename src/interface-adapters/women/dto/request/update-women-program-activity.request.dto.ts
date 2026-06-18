import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateWomenProgramActivityRequestDto {
  @ApiProperty()
  @IsBoolean()
  completed: boolean;
}
