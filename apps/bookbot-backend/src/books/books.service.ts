import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import type { ConfigType } from '@nestjs/config';
import {
  applyDefaultOrdering,
  mapToListItem,
  mapEditions,
  mapFilters,
  type BookDetailResponse,
  type BookFiltersResponse,
  type BookListResponse,
  type ListBooksQuery,
} from '@bookbot/book-utils';
import { BooksRepository } from './books.repository';
import { booksConfig } from './books.config';

@Injectable()
export class BooksService {

  constructor(
    private readonly booksRepository: BooksRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @Inject(booksConfig.KEY) private readonly config: ConfigType<typeof booksConfig>,
  ) {}

  async listBooks(query: ListBooksQuery): Promise<BookListResponse> {
    const { data, totalCount } = await this.booksRepository.findMany(query);

    const items = applyDefaultOrdering(
      data.map((book) => mapToListItem(book)),
    );

    return {
      data: items,
      meta: {
        page: query.page,
        limit: this.config.pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / this.config.pageSize),
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

  async getFilters(): Promise<BookFiltersResponse> {
    const cached = await this.cache.get<BookFiltersResponse>(
      this.config.filtersCacheKey,
    );
    if (cached) {
      return cached;
    }

    const raw = await this.booksRepository.getFilters();
    const filters = mapFilters(raw);

    await this.cache.set(
      this.config.filtersCacheKey,
      filters,
    );

    return filters;
  }
}
