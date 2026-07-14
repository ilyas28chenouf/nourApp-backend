import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Matches, Max, Min } from 'class-validator';

export class TafsirCollectionKeyParamDto {
  @ApiProperty({ example: 'ibn-kathir', pattern: '^[a-z0-9-]+$' })
  @Matches(/^[a-z0-9-]+$/)
  key: string;
}

export class TafsirItemParamDto extends TafsirCollectionKeyParamDto {
  @ApiProperty({ example: 1, minimum: 1, maximum: 114 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(114)
  surahNumber: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  ayahNumber: number;
}
