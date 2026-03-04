import { Controller, Get, Param, Query } from '@nestjs/common';
import type { BookDetailResponse, BookListResponse } from '@bookbot/book-utils';
import { BooksService } from './books.service';
import { parseListBooksQuery } from './dto/list-books.query';


@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async listBooks(
    @Query() query: Record<string, string>,
  ): Promise<BookListResponse> {
    return this.booksService.listBooks(parseListBooksQuery(query));
  }

  @Get(':slug')
  async getBook(@Param('slug') slug: string): Promise<BookDetailResponse> {
    return this.booksService.getBookBySlug(slug);
  }
}
