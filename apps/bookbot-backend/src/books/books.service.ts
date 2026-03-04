import { Injectable, NotFoundException } from '@nestjs/common';
import {
  applyDefaultOrdering,
  mapToListItem,
  mapEditions,
  type BookDetailResponse,
  type BookListResponse,
  type ListBooksQuery,
} from '@bookbot/book-utils';
import { BooksRepository } from './books.repository';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async listBooks(query: ListBooksQuery): Promise<BookListResponse> {
    const { data, totalCount } = await this.booksRepository.findMany(query);

    const items = applyDefaultOrdering(
      data.map((book) => mapToListItem(book)),
    );

    return {
      data: items,
      meta: {
        page: query.page,
        limit: BooksRepository.PAGE_SIZE,
        totalCount,
        totalPages: Math.ceil(totalCount / BooksRepository.PAGE_SIZE),
      },
    };
  }

  async getBookBySlug(slug: string): Promise<BookDetailResponse> {
    const book = await this.booksRepository.findBySlug(slug);

    if (!book) {
      throw new NotFoundException(`Book with slug "${slug}" not found`);
    }

    const editions = mapEditions(book.editions);
    const inStock = editions.some((e) => e.availableCount > 0);

    return {
      id: book.id,
      slug: book.slug,
      name: book.name,
      description: book.description,
      editions,
      inStock,
    };
  }
}
