import type { BookListItemResponse } from './types.js';

export function applyDefaultOrdering(
  items: BookListItemResponse[],
): BookListItemResponse[] {
  const inStock = items.filter((i) => i.inStock);
  const soldOut = items.filter((i) => !i.inStock);
  return [...inStock, ...soldOut];
}

