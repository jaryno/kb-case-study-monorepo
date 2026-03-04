import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { BookListItemResponse } from '@bookbot/book-utils';
import StockBadge from './StockBadge';
import PriceDisplay from './PriceDisplay';

interface BookCardProps {
  book: BookListItemResponse;
}

export default async function BookCard({ book }: BookCardProps) {
  const t = await getTranslations('books');

  const priceLabel =
    book.minPrice !== null
      ? book.minPrice === book.maxPrice
        ? t('priceSingle', { price: book.minPrice })
        : t('priceRange', { min: book.minPrice, max: book.maxPrice! })
      : null;

  const stockLabel = book.inStock
    ? t('inStockCount', { count: book.availableCount })
    : t('soldOut');

  return (
    <Link
      href={`/books/${book.slug}`}
      className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <h2 className="font-semibold text-lg truncate">{book.name}</h2>
      <p className="text-sm text-gray-500 mt-1">
        {book.authors.map((a) => a.name).join(', ')}
      </p>
      <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
        {book.languages.join(', ')} · {book.bindings.join(', ')}
      </div>
      <div className="flex items-center justify-between mt-3">
        <PriceDisplay label={priceLabel} />
        <StockBadge label={stockLabel} inStock={book.inStock} />
      </div>
    </Link>
  );
}

