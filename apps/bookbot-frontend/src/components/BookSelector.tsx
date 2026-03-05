'use client';

import { useState } from 'react';
import type { BookDetailResponse, BookEditionResponse, BookItemResponse } from '@bookbot/book-utils';

interface BookSelectorLabels {
  selectLanguage: string;
  selectBinding: string;
  selectCondition: string;
  currency: string;
  unavailable: string;
  inStock: string;
}

interface BookSelectorProps {
  book: BookDetailResponse;
  labels: BookSelectorLabels;
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export default function BookSelector({ book, labels }: BookSelectorProps) {
  const editions = book.editions;

  const languages = unique(editions.map((e) => e.language));
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const editionsForLanguage: BookEditionResponse[] = selectedLanguage
    ? editions.filter((e) => e.language === selectedLanguage)
    : [];

  const bindings = unique(editionsForLanguage.map((e) => e.binding));
  const [selectedBinding, setSelectedBinding] = useState<string | null>(null);

  const selectedEdition: BookEditionResponse | null =
    selectedLanguage && selectedBinding
      ? (editionsForLanguage.find((e) => e.binding === selectedBinding) ?? null)
      : null;

  const availableItems: BookItemResponse[] = selectedEdition
    ? selectedEdition.items.filter((i) => i.status === 'AVAILABLE')
    : [];

  const conditions = unique(availableItems.map((i) => i.condition));
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

  const itemsForCondition: BookItemResponse[] = selectedCondition
    ? availableItems.filter((i) => i.condition === selectedCondition)
    : [];

  const inStockCount = itemsForCondition.length;
  const selectedItem: BookItemResponse | null = itemsForCondition[0] ?? null;

  function handleLanguageChange(lang: string) {
    setSelectedLanguage(lang);
    setSelectedBinding(null);
    setSelectedCondition(null);
  }

  function handleBindingChange(binding: string) {
    setSelectedBinding(binding);
    setSelectedCondition(null);
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Step 1 – Language */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{labels.selectLanguage}</p>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                selectedLanguage === lang
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 – Binding */}
      {selectedLanguage && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">{labels.selectBinding}</p>
          <div className="flex flex-wrap gap-2">
            {bindings.map((binding) => (
              <button
                key={binding}
                onClick={() => handleBindingChange(binding)}
                className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                  selectedBinding === binding
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {binding}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 – Condition */}
      {selectedEdition && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">{labels.selectCondition}</p>
          {conditions.length === 0 ? (
            <p className="text-sm text-red-500">{labels.unavailable}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {conditions.map((condition) => (
                <button
                  key={condition}
                  onClick={() => setSelectedCondition(condition)}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                    selectedCondition === condition
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {selectedItem && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-gray-700">
              {selectedLanguage} · {selectedBinding} · {selectedCondition}
            </span>
            <span className="text-xs text-gray-500">
              {labels.inStock}: {inStockCount}
            </span>
          </div>
          <span className="text-lg font-bold text-blue-700">
            {selectedItem.price} {labels.currency}
          </span>
        </div>
      )}
    </div>
  );
}



