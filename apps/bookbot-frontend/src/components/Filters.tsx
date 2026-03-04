'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { BookFiltersResponse } from '@bookbot/book-utils';
import FilterSection from './FilterSection';
import type { FilterOption } from './FilterSection';

interface FiltersProps {
  filters: BookFiltersResponse;
}

interface FilterSectionConfig {
  titleKey: string;
  filterKey: string;
  options: FilterOption[];
}

function toCodeOptions(items: { code: string; count: number }[]): FilterOption[] {
  return items.map(({ code, count }) => ({ label: code, value: code, count }));
}

function toNameOptions(items: { id: number; name: string; count: number }[]): FilterOption[] {
  return items.map(({ id, name, count }) => ({ label: name, value: String(id), count }));
}

export default function Filters({ filters }: FiltersProps) {
  const t = useTranslations('filters');
  const router = useRouter();
  const searchParams = useSearchParams();

  const sections: FilterSectionConfig[] = useMemo(() => [
    { titleKey: 'language', filterKey: 'languages', options: toCodeOptions(filters.languages) },
    { titleKey: 'binding', filterKey: 'bindings', options: toCodeOptions(filters.bindings) },
    { titleKey: 'condition', filterKey: 'conditions', options: toCodeOptions(filters.conditions) },
    { titleKey: 'authors', filterKey: 'authorIds', options: toNameOptions(filters.authors) },
    { titleKey: 'publishers', filterKey: 'publisherIds', options: toNameOptions(filters.publishers) },
  ], [filters]);

  function toggleFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key)?.split(',').filter(Boolean) ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    if (updated.length) {
      params.set(key, updated.join(','));
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  }

  function isActive(key: string, value: string) {
    return searchParams.get(key)?.split(',').includes(value) ?? false;
  }

  function toggleInStock() {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('inStock') === 'true') {
      params.delete('inStock');
    } else {
      params.set('inStock', 'true');
    }
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  }

  function clearAll() {
    router.push('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">{t('title')}</h2>
        {searchParams.toString() && (
          <button
            onClick={clearAll}
            className="text-xs text-blue-600 hover:underline"
          >
            {t('clearAll')}
          </button>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={searchParams.get('inStock') === 'true'}
          onChange={toggleInStock}
        />
        {t('inStockOnly')}
      </label>

      {sections.map(({ titleKey, filterKey, options }) => (
        <FilterSection
          key={filterKey}
          title={t(titleKey)}
          options={options}
          filterKey={filterKey}
          isActive={isActive}
          onToggle={toggleFilter}
        />
      ))}
    </div>
  );
}

