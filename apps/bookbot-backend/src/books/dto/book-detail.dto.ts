import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthorRefDto } from './book-list.dto';

export class PublisherRefDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Chilton Books' })
  name!: string;
}

export class BookItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'GOOD' })
  condition!: string;

  @ApiProperty({ example: 299 })
  price!: number;

  @ApiProperty({ example: 'AVAILABLE' })
  status!: string;
}

export class BookEditionDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'en' })
  language!: string;

  @ApiProperty({ example: 'HARDCOVER' })
  binding!: string;

  @ApiPropertyOptional({ example: 1965, nullable: true })
  yearPublished!: number | null;

  @ApiPropertyOptional({ example: 412, nullable: true })
  pageCount!: number | null;

  @ApiPropertyOptional({ example: 720, nullable: true })
  readingTimeMinutes!: number | null;

  @ApiPropertyOptional({ example: 'First edition hardcover.', nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ example: '978-0-441-17271-9', nullable: true })
  isbn!: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg', nullable: true })
  coverImageUrl!: string | null;

  @ApiPropertyOptional({ type: PublisherRefDto, nullable: true })
  publisher!: PublisherRefDto | null;

  @ApiProperty({ type: [AuthorRefDto] })
  authors!: AuthorRefDto[];

  @ApiProperty({ type: [BookItemDto] })
  items!: BookItemDto[];

  @ApiProperty({ example: 2 })
  availableCount!: number;
}

export class BookDetailDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'dune' })
  slug!: string;

  @ApiProperty({ example: 'Dune' })
  name!: string;

  @ApiPropertyOptional({ example: 'A science fiction novel.', nullable: true })
  description!: string | null;

  @ApiProperty({ type: [BookEditionDto] })
  editions!: BookEditionDto[];

  @ApiProperty({ example: true })
  inStock!: boolean;
}
