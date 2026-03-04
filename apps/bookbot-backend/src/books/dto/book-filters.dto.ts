import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FilterOptionCountDto {
  @ApiProperty({ example: 'en' })
  code!: string;

  @ApiProperty({ example: 42 })
  count!: number;
}

export class FilterOptionAuthorDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Frank Herbert' })
  name!: string;

  @ApiProperty({ example: 'frank-herbert' })
  slug!: string;

  @ApiProperty({ example: 3 })
  count!: number;
}

export class FilterOptionPublisherDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Chilton Books' })
  name!: string;

  @ApiProperty({ example: 5 })
  count!: number;
}

export class FilterRangeDto {
  @ApiProperty({ example: 99 })
  min!: number;

  @ApiProperty({ example: 999 })
  max!: number;
}

export class BookFiltersResponseDto {
  @ApiProperty({ type: [FilterOptionCountDto] })
  languages!: FilterOptionCountDto[];

  @ApiProperty({ type: [FilterOptionCountDto] })
  bindings!: FilterOptionCountDto[];

  @ApiProperty({ type: [FilterOptionCountDto] })
  conditions!: FilterOptionCountDto[];

  @ApiProperty({ type: [FilterOptionAuthorDto] })
  authors!: FilterOptionAuthorDto[];

  @ApiProperty({ type: [FilterOptionPublisherDto] })
  publishers!: FilterOptionPublisherDto[];

  @ApiPropertyOptional({ type: FilterRangeDto, nullable: true })
  priceRange!: FilterRangeDto | null;

  @ApiPropertyOptional({ type: FilterRangeDto, nullable: true })
  yearRange!: FilterRangeDto | null;
}
