import type { BookEditionResponse } from '@bookbot/book-utils';
import StockBadge from './StockBadge';

export interface EditionLabels {
  stockLabel: string;
  publisherLabel: string | null;
  pagesLabel: string | null;
  itemPriceLabels: Record<number, string>;
}

interface EditionCardProps {
  edition: BookEditionResponse;
  labels: EditionLabels;
}

export default function EditionCard({ edition, labels }: EditionCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {edition.language} · {edition.binding}
          {edition.yearPublished && ` · ${edition.yearPublished}`}
        </h3>
        <StockBadge
          label={labels.stockLabel}
          inStock={edition.availableCount > 0}
        />
      </div>

      <p className="text-sm text-gray-500 mt-1">
        {edition.authors.map((a) => a.name).join(', ')}
      </p>
      {labels.publisherLabel && (
        <p className="text-sm text-gray-400">{labels.publisherLabel}</p>
      )}
      {labels.pagesLabel && (
        <p className="text-sm text-gray-400">{labels.pagesLabel}</p>
      )}

      {edition.items.length > 0 && (
        <div className="mt-3 space-y-1">
          {edition.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-1"
            >
              <span>{item.condition}</span>
              <div className="flex items-center gap-3">
                <span className="font-semibold">
                  {labels.itemPriceLabels[item.id]}
                </span>
                <span
                  className={
                    item.status === 'AVAILABLE'
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }
                >
                  {item.status === 'AVAILABLE' ? '✓' : '✗'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

