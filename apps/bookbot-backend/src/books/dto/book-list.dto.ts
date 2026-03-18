import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto';

export class AuthorRefDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Frank Herbert' })
  name!: string;

  @ApiProperty({ example: 'frank-herbert' })
  slug!: string;
}

export class BookListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'dune' })
  slug!: string;

  @ApiProperty({ example: 'Dune' })
  name!: string;

  @ApiPropertyOptional({ example: 'A science fiction novel.', nullable: true })
  description!: string | null;

  @ApiProperty({ type: [AuthorRefDto] })
  authors!: AuthorRefDto[];

  @ApiProperty({ type: [String], example: ['en', 'cs'] })
  languages!: string[];

  @ApiProperty({ type: [String], example: ['HARDCOVER', 'PAPERBACK'] })
  bindings!: string[];

  @ApiPropertyOptional({ example: 199, nullable: true })
  minPrice!: number | null;

  @ApiPropertyOptional({ example: 599, nullable: true })
  maxPrice!: number | null;

  @ApiProperty({ example: 3 })
  availableCount!: number;

  @ApiProperty({ example: true })
  inStock!: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg', nullable: true })
  coverImageUrl!: string | null;
}

export class BookListResponseDto {
  @ApiProperty({ type: [BookListItemDto] })
  data!: BookListItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
