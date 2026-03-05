import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { fetchBook } from '@/lib/api';
import StockBadge from '@/components/StockBadge';
import BookSelector from '@/components/BookSelector';

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
      <BookSelector
        book={book}
        labels={{
          selectLanguage: t('books.selectLanguage'),
          selectBinding: t('books.selectBinding'),
          selectCondition: t('books.selectCondition'),
          unavailable: t('books.soldOutEdition'),
          currency: t('common.currency'),
          inStock: t('books.inStock'),
        }}
      />
    </main>
  );
}


