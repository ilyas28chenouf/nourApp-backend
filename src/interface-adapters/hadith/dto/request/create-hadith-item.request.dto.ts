import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateHadithItemRequestDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  hadithNumber: number;

  @ApiProperty({ example: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  arabic: string;

  @ApiPropertyOptional({ example: 'Actions are judged by intentions.' })
  @IsOptional()
  @IsString()
  english?: string;

  @ApiPropertyOptional({
    example: 'Les actes ne valent que par les intentions.',
  })
  @IsOptional()
  @IsString()
  french?: string;

  @ApiPropertyOptional({ example: 'Sahih' })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional({ example: 'Umar ibn al-Khattab' })
  @IsOptional()
  @IsString()
  narrator?: string;

  @ApiPropertyOptional({ example: 'Revelation' })
  @IsOptional()
  @IsString()
  chapter?: string;

  @ApiPropertyOptional({ example: 'Book 1, Hadith 1' })
  @IsOptional()
  @IsString()
  sourceReference?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
