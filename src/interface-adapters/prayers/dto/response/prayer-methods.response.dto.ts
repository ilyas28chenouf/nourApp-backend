import { ApiProperty } from '@nestjs/swagger';

export class PrayerMethodsResponseDto {
  @ApiProperty({ type: Object })
  methods: Record<string, unknown>;

  @ApiProperty({ example: 'Algeria' })
  default_method: string;

  @ApiProperty({ type: Object })
  usage: Record<string, unknown>;
}
