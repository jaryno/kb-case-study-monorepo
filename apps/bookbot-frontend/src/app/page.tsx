import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { fetchBooks, fetchFilters } from '@/lib/api';
import BookList from '@/components/BookList';
import Filters from '@/components/Filters';
import Pagination from '@/components/Pagination';

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations();
  const params = await searchParams;

  const query: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value) query[key] = Array.isArray(value) ? value.join(',') : value;
  }

  const [books, filters] = await Promise.all([
    fetchBooks(query),
    fetchFilters(),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('books.title')}</h1>
      <div className="flex gap-8">
        <aside className="w-64 shrink-0 hidden md:block">
          <Suspense>
            <Filters filters={filters} />
          </Suspense>
        </aside>
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">
            {t('books.totalFound', { count: books.meta.totalCount })}
          </p>
          <BookList books={books.data} />
          <Pagination
            currentPage={books.meta.page}
            totalPages={books.meta.totalPages}
            currentParams={query}
          />
        </div>
      </div>
    </main>
  );
}
