import { getTranslations } from 'next-intl/server';
import type { BookListItemResponse } from '@bookbot/book-utils';
import BookCard from './BookCard';

interface BookListProps {
  books: BookListItemResponse[];
}

export default async function BookList({ books }: BookListProps) {
  const t = await getTranslations('books');

  if (books.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">{t('noBooksFound')}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

