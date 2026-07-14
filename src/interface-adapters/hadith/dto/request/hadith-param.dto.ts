import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Matches, Min } from 'class-validator';

export class HadithCollectionKeyParamDto {
  @ApiProperty({ example: 'bukhari', pattern: '^[a-z0-9-]+$' })
  @Matches(/^[a-z0-9-]+$/)
  key: string;
}

export class HadithItemParamDto extends HadithCollectionKeyParamDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  hadithNumber: number;
}
