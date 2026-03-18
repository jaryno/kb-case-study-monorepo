import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Language, Binding, BookCondition } from '@bookbot/constants';

export class ListBooksQueryDto {
  @ApiProperty({ required: false, example: 1, description: 'Page number (1-based)', default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    type: String,
    example: 'en,cs',
    description: 'Comma-separated list of language codes',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Language, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  languages?: string[];

  @ApiPropertyOptional({
    type: String,
    example: 'HARDCOVER,PAPERBACK',
    description: 'Comma-separated list of binding types',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Binding, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  bindings?: string[];

  @ApiPropertyOptional({
    type: String,
    example: 'NEW,GOOD',
    description: 'Comma-separated list of book conditions',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(BookCondition, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  conditions?: string[];

  @ApiPropertyOptional({
    type: String,
    example: '1,2,3',
    description: 'Comma-separated list of author IDs',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((s: string) => parseInt(s.trim(), 10))
      : value,
  )
  authorIds?: number[];

  @ApiPropertyOptional({
    type: String,
    example: '1,2',
    description: 'Comma-separated list of publisher IDs',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((s: string) => parseInt(s.trim(), 10))
      : value,
  )
  publisherIds?: number[];

  @ApiPropertyOptional({ example: 99, description: 'Minimum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceFrom?: number;

  @ApiPropertyOptional({ example: 999, description: 'Maximum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceTo?: number;

  @ApiPropertyOptional({ example: 2000, description: 'Minimum publication year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearFrom?: number;

  @ApiPropertyOptional({ example: 2024, description: 'Maximum publication year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearTo?: number;

  @ApiPropertyOptional({ example: true, description: 'Filter to in-stock books only' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return value;
  })
  @IsBoolean()
  inStock?: boolean;
}
