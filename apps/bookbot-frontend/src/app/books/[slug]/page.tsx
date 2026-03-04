import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { fetchBook } from '@/lib/api';
import type { BookEditionResponse } from '@bookbot/book-utils';
import StockBadge from '@/components/StockBadge';
import EditionCard from '@/components/EditionCard';
import type { EditionLabels } from '@/components/EditionCard';

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations();
  const { slug } = await params;

  let book;
  try {
    book = await fetchBook(slug);
  } catch {
    notFound();
  }

  const stockLabel = book.inStock ? t('books.inStock') : t('books.soldOut');

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">
        {t('common.backToList')}
      </Link>

      <h1 className="text-3xl font-bold">{book.name}</h1>
      {book.description && (
        <p className="text-gray-600 mt-2">{book.description}</p>
      )}

      <div className="mt-3">
        <StockBadge label={stockLabel} inStock={book.inStock} />
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">{t('books.editions')}</h2>
      <div className="space-y-4">
        {book.editions.map((edition) => (
          <EditionCard
            key={edition.id}
            edition={edition}
            labels={buildEditionLabels(edition, t)}
          />
        ))}
      </div>
    </main>
  );
}

function buildEditionLabels(
  edition: BookEditionResponse,
  t: Awaited<ReturnType<typeof getTranslations>>,
): EditionLabels {
  const stockLabel =
    edition.availableCount > 0
      ? t('books.inStockCount', { count: edition.availableCount })
      : t('books.soldOut');

  const publisherLabel = edition.publisher
    ? t('books.publisher', { name: edition.publisher.name })
    : null;

  let pagesLabel: string | null = null;
  if (edition.pageCount) {
    pagesLabel = t('books.pages', { count: edition.pageCount });
    if (edition.readingTimeMinutes) {
      pagesLabel += ` · ${t('books.readingTime', { hours: Math.round(edition.readingTimeMinutes / 60) })}`;
    }
  }

  const itemPriceLabels: Record<number, string> = {};
  for (const item of edition.items) {
    itemPriceLabels[item.id] = t('books.priceSingle', { price: item.price });
  }

  return { stockLabel, publisherLabel, pagesLabel, itemPriceLabels };
}

