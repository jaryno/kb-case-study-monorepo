import { registerAs } from '@nestjs/config';

export const booksConfig = registerAs('books', () => ({
  pageSize: 10,
  topFilterLimit: 10,
  filtersCacheKey: process.env['BOOKS_FILTERS_CACHE_KEY'] ?? 'books:filters',
}));

