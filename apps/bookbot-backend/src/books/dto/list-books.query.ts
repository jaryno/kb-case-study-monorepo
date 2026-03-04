import type { ListBooksQuery } from '@bookbot/book-utils';

export type { ListBooksQuery };

export function parseListBooksQuery(raw: Record<string, string | undefined>): ListBooksQuery {
  return {
    page: Math.max(1, parseInt(raw.page ?? '1', 10) || 1),
  };
}
