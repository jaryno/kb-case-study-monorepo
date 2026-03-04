export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface BookListItemResponse {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  authors: { id: number; name: string; slug: string }[];
  languages: string[];
  bindings: string[];
  minPrice: number | null;
  maxPrice: number | null;
  availableCount: number;
  inStock: boolean;
  coverImageUrl: string | null;
}

export type BookListResponse = PaginatedResponse<BookListItemResponse>;

export interface BookItemResponse {
  id: number;
  condition: string;
  price: number;
  status: string;
}

export interface BookEditionResponse {
  id: number;
  language: string;
  binding: string;
  yearPublished: number | null;
  pageCount: number | null;
  readingTimeMinutes: number | null;
  description: string | null;
  isbn: string | null;
  coverImageUrl: string | null;
  publisher: { id: number; name: string } | null;
  authors: { id: number; name: string; slug: string }[];
  items: BookItemResponse[];
  availableCount: number;
}

export interface BookDetailResponse {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  editions: BookEditionResponse[];
  inStock: boolean;
}

export interface ListBooksQuery {
  page: number;
  languages?: string[];
  bindings?: string[];
  conditions?: string[];
  authorIds?: number[];
  publisherIds?: number[];
  priceFrom?: number;
  priceTo?: number;
  yearFrom?: number;
  yearTo?: number;
  inStock?: boolean;
}

export interface EditionItemInput {
  id: number;
  condition: string;
  price: number | { toNumber(): number };
  status: string;
}

export interface EditionInput {
  id: number;
  language: string;
  binding: string;
  yearPublished: number | null;
  pageCount: number | null;
  readingTimeMinutes: number | null;
  description: string | null;
  isbn: string | null;
  coverImageUrl: string | null;
  publisher: { id: number; name: string } | null;
  authors: Array<{
    author: { id: number; name: string; slug: string };
  }>;
  items: EditionItemInput[];
}

export interface BookWithEditions {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  editions: EditionInput[];
}

export interface FilterOptionCount {
  code: string;
  count: number;
}

export interface FilterOptionAuthor {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface FilterOptionPublisher {
  id: number;
  name: string;
  count: number;
}

export interface FilterRange {
  min: number;
  max: number;
}

export interface BookFiltersResponse {
  languages: FilterOptionCount[];
  bindings: FilterOptionCount[];
  conditions: FilterOptionCount[];
  authors: FilterOptionAuthor[];
  publishers: FilterOptionPublisher[];
  priceRange: FilterRange | null;
  yearRange: FilterRange | null;
}

