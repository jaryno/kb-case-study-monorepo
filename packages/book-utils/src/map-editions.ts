import { CopyStatus } from '@bookbot/constants';
import type {
  BookEditionResponse,
  BookItemResponse,
  EditionInput,
} from './types.js';

export function mapEditions(
  editions: EditionInput[],
): BookEditionResponse[] {
  return editions.map((edition) => {
    const items: BookItemResponse[] = edition.items.map((item) => ({
      id: item.id,
      condition: item.condition,
      price:
        typeof item.price === 'number'
          ? item.price
          : item.price.toNumber(),
      status: item.status,
    }));

    const availableCount = edition.items.filter(
      (item) => item.status === CopyStatus.AVAILABLE,
    ).length;

    return {
      id: edition.id,
      language: edition.language,
      binding: edition.binding,
      yearPublished: edition.yearPublished,
      pageCount: edition.pageCount,
      readingTimeMinutes: edition.readingTimeMinutes,
      description: edition.description,
      isbn: edition.isbn,
      coverImageUrl: edition.coverImageUrl,
      publisher: edition.publisher
        ? { id: edition.publisher.id, name: edition.publisher.name }
        : null,
      authors: edition.authors.map((a) => ({
        id: a.author.id,
        name: a.author.name,
        slug: a.author.slug,
      })),
      items,
      availableCount,
    };
  });
}

