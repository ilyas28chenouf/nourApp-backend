import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  WomenProgramResponseDto,
  WomenProgramTodayResponseDto,
} from './women-program.response.dto';

export class WomenProgramCurrentResponseDto {
  @ApiProperty()
  hasActiveProgram: boolean;

  @ApiPropertyOptional({ type: WomenProgramResponseDto, nullable: true })
  program: WomenProgramResponseDto | null;

  @ApiPropertyOptional({ type: WomenProgramTodayResponseDto, nullable: true })
  today: WomenProgramTodayResponseDto | null;
}
