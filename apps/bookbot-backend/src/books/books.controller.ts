import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { BookDetailResponse, BookFiltersResponse, BookListResponse } from '@bookbot/book-utils';
import { BooksService } from './books.service';
import { ListBooksQueryDto } from './dto/list-books-query.dto';
import { BookListResponseDto } from './dto/book-list.dto';
import { BookDetailDto } from './dto/book-detail.dto';
import { BookFiltersResponseDto } from './dto/book-filters.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'List books with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated list of books', type: BookListResponseDto })
  async listBooks(
    @Query() query: ListBooksQueryDto,
  ): Promise<BookListResponse> {
    return this.booksService.listBooks(query);
  }

  @Get('filters')
  @ApiOperation({ summary: 'Get available filter options' })
  @ApiResponse({ status: 200, description: 'Available filter options', type: BookFiltersResponseDto })
  async getFilters(): Promise<BookFiltersResponse> {
    return this.booksService.getFilters();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get book detail by slug' })
  @ApiParam({ name: 'slug', description: 'Book slug', example: 'dune' })
  @ApiResponse({ status: 200, description: 'Book detail', type: BookDetailDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBook(@Param('slug') slug: string): Promise<BookDetailResponse> {
    return this.booksService.getBookBySlug(slug);
  }
}


