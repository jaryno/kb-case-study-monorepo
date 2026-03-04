import { CopyStatus } from '@bookbot/constants';
import type { BookListItemResponse, BookWithEditions } from './types.js';

export function mapToListItem(book: BookWithEditions): BookListItemResponse {
  const allAuthors = new Map<
    number,
    { id: number; name: string; slug: string }
  >();
  const allLanguages = new Set<string>();
  const allBindings = new Set<string>();
  let minPrice: number | null = null;
  let maxPrice: number | null = null;
  let availableCount = 0;
  let coverImageUrl: string | null = null;

  for (const edition of book.editions) {
    allLanguages.add(edition.language);
    allBindings.add(edition.binding);

    if (edition.coverImageUrl && !coverImageUrl) {
      coverImageUrl = edition.coverImageUrl;
    }

    for (const a of edition.authors) {
      if (!allAuthors.has(a.author.id)) {
        allAuthors.set(a.author.id, {
          id: a.author.id,
          name: a.author.name,
          slug: a.author.slug,
        });
      }
    }

    for (const item of edition.items) {
      if (item.status === CopyStatus.AVAILABLE) {
        availableCount++;
        const price =
          typeof item.price === 'number'
            ? item.price
            : item.price.toNumber();
        if (minPrice === null || price < minPrice) minPrice = price;
        if (maxPrice === null || price > maxPrice) maxPrice = price;
      }
    }
  }

  return {
    id: book.id,
    slug: book.slug,
    name: book.name,
    description: book.description,
    authors: Array.from(allAuthors.values()),
    languages: Array.from(allLanguages),
    bindings: Array.from(allBindings),
    minPrice,
    maxPrice,
    availableCount,
    inStock: availableCount > 0,
    coverImageUrl,
  };
}

