'use client';

import { useUseCases } from '@/hooks/useUseCases';
import UseCaseFilters from '@/components/use-cases/UseCaseFilters';
import UseCaseGrid from '@/components/use-cases/UseCaseGrid';

export default function UseCasesPage() {
  const {
    cases,
    loading,
    refreshing,
    error,
    refresh,
    filters,
    updateSearchQuery,
    updateStatusFilter,
    updateIndustryFilters,
  } = useUseCases();

  const hasFilters = Boolean(filters.searchQuery || filters.statusFilter || filters.industryFilters.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Page header */}
      <div className="flex items-end justify-between mb-8 animate-fade-up">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--brand)' }}
          >
            Library
          </p>
          <h1 className="text-3xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            Use Cases
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {refreshing && (
            <span
              className="text-xs animate-pulse"
              style={{ color: 'var(--text-muted)' }}
            >
              Refreshing...
            </span>
          )}
          <span
            className="text-sm tabular-nums font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            {cases.length} {cases.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border p-3 text-sm animate-fade-up"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <p className="mb-3">Error: {error}</p>
          <button
            onClick={refresh}
            className="text-sm font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
            style={{ color: 'var(--brand)' }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="animate-fade-up animate-delay-1">
        <UseCaseFilters
          searchQuery={filters.searchQuery}
          statusFilter={filters.statusFilter}
          industryFilters={filters.industryFilters}
          onSearchChange={updateSearchQuery}
          onStatusChange={updateStatusFilter}
          onIndustryChange={updateIndustryFilters}
        />
      </div>

      <div className="animate-fade-up animate-delay-2">
        <UseCaseGrid cases={cases} loading={loading} hasFilters={hasFilters} />
      </div>
    </div>
  );
}
