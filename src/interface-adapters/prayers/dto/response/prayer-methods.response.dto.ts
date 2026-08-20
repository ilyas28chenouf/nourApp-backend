import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';

export class PrayerMethodDetailsResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  fajr_angle?: string;

  @ApiPropertyOptional()
  isha_angle?: string;

  @ApiPropertyOptional()
  isha_description?: string;

  @ApiPropertyOptional()
  asr_calculation?: string;

  @ApiPropertyOptional()
  madhab?: string;
}

@ApiExtraModels(PrayerMethodDetailsResponseDto)
export class PrayerMethodsResponseDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      $ref: getSchemaPath(PrayerMethodDetailsResponseDto),
    },
    description:
      'Provider-supported methods; UOIF is ordered first when present.',
  })
  methods: Record<string, PrayerMethodDetailsResponseDto>;

  @ApiProperty({ example: 'MuslimWorldLeague' })
  default_method: string;

  @ApiProperty({
    example: 'Add ?method=MethodName to /api/prayer-times endpoint',
  })
  usage: string;
}
