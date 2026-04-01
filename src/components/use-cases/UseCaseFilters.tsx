'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { DemoStatus, Industry } from '@/lib/types';

const INDUSTRIES: Industry[] = [
  'Finance',
  'HR',
  'Retail',
  'Healthcare',
  'Legal',
  'Manufacturing',
  'Education',
  'Real Estate',
  'Insurance',
  'Other',
];

const STATUSES: DemoStatus[] = ['Ready', 'In Progress', 'Not Started'];

interface UseCaseFiltersProps {
  searchQuery: string;
  statusFilter: DemoStatus | null;
  industryFilters: Industry[];
  onSearchChange: (query: string) => void;
  onStatusChange: (status: DemoStatus | null) => void;
  onIndustryChange: (industries: Industry[]) => void;
}

/**
 * [P2 /arrange] Inline toolbar pattern — no card chrome, no shadow, just controls.
 * [P1 /harden]  focus-visible rings on all interactive elements.
 * [P0 /colorize] brand tokens throughout.
 * [P2 /optimize] Debounced search (300ms) to reduce re-renders during typing.
 */
export default function UseCaseFilters({
  searchQuery,
  statusFilter,
  industryFilters,
  onSearchChange,
  onStatusChange,
  onIndustryChange,
}: UseCaseFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [localSearch, onSearchChange, searchQuery]);

  const toggleIndustry = useCallback(
    (industry: Industry) => {
      if (industryFilters.includes(industry)) {
        onIndustryChange(industryFilters.filter((i) => i !== industry));
      } else {
        onIndustryChange([...industryFilters, industry]);
      }
    },
    [industryFilters, onIndustryChange]
  );

  const clearFilters = () => {
    onSearchChange('');
    onStatusChange(null);
    onIndustryChange([]);
  };

  const hasActiveFilters = searchQuery || statusFilter || industryFilters.length > 0;

  return (
    <div className="mb-6 space-y-4" role="search" aria-label="Filter use cases">
      {/* Search */}
      <div className="flex items-center gap-3">
        <label htmlFor="uc-search" className="text-sm font-medium flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
          Search
        </label>
        <input
          id="uc-search"
          type="search"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Title, problem, or solution…"
          className="flex-1 max-w-sm px-3 py-1.5 rounded-lg text-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Status + Industry filters as pill strip */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-widest flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
          Status:
        </span>
        {STATUSES.map((status) => {
          const active = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() => onStatusChange(active ? null : status)}
              aria-pressed={active}
              className="px-2.5 py-1 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
              style={
                active
                  ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' }
                  : { background: 'var(--surface)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }
              }
            >
              {status}
            </button>
          );
        })}

        <span
          className="text-xs font-medium uppercase tracking-widest flex-shrink-0 ml-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Industry:
        </span>
        {INDUSTRIES.map((industry) => {
          const active = industryFilters.includes(industry);
          return (
            <button
              key={industry}
              onClick={() => toggleIndustry(industry)}
              aria-pressed={active}
              className="px-2.5 py-1 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
              style={
                active
                  ? { background: 'var(--brand-light)', color: 'var(--brand)', borderColor: 'var(--brand-muted)' }
                  : { background: 'var(--surface)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }
              }
            >
              {industry}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-2 text-xs font-medium underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--brand)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')}
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
