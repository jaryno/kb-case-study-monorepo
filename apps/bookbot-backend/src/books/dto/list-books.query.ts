import type { ListBooksQuery } from '@bookbot/book-utils';

export type { ListBooksQuery };

function parseCsvStrings(value: string | undefined): string[] | undefined {
  if (!value) return undefined;
  const items = value.split(',').map((s) => s.trim()).filter(Boolean);
  return items.length ? items : undefined;
}

function parseCsvNumbers(value: string | undefined): number[] | undefined {
  if (!value) return undefined;
  const items = value
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));
  return items.length ? items : undefined;
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = parseFloat(value);
  return isNaN(n) ? undefined : n;
}

function parseOptionalBoolean(value: string | undefined): boolean | undefined {
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return undefined;
}

export function parseListBooksQuery(raw: Record<string, string | undefined>): ListBooksQuery {
  return {
    page: Math.max(1, parseInt(raw.page ?? '1', 10) || 1),
    languages: parseCsvStrings(raw.languages),
    bindings: parseCsvStrings(raw.bindings),
    conditions: parseCsvStrings(raw.conditions),
    authorIds: parseCsvNumbers(raw.authorIds),
    publisherIds: parseCsvNumbers(raw.publisherIds),
    priceFrom: parseOptionalNumber(raw.priceFrom),
    priceTo: parseOptionalNumber(raw.priceTo),
    yearFrom: parseOptionalNumber(raw.yearFrom),
    yearTo: parseOptionalNumber(raw.yearTo),
    inStock: parseOptionalBoolean(raw.inStock),
  };
}
