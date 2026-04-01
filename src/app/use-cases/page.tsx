'use client';

import { useUseCases } from '@/hooks/useUseCases';
import UseCaseFilters from '@/components/use-cases/UseCaseFilters';
import UseCaseGrid from '@/components/use-cases/UseCaseGrid';

export default function UseCasesPage() {
  const {
    cases,
    loading,
    error,
    filters,
    updateSearchQuery,
    updateStatusFilter,
    updateIndustryFilters,
  } = useUseCases();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* [P2 /distill] Removed redundant subtitle "Browse and manage all AI use cases" */}
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Use Cases
        </h1>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {cases.length} {cases.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {error && (
        <div
          className="mb-6 rounded-lg p-3 text-sm border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          Error: {error}
        </div>
      )}

      <UseCaseFilters
        searchQuery={filters.searchQuery}
        statusFilter={filters.statusFilter}
        industryFilters={filters.industryFilters}
        onSearchChange={updateSearchQuery}
        onStatusChange={updateStatusFilter}
        onIndustryChange={updateIndustryFilters}
      />

      <UseCaseGrid cases={cases} loading={loading} />
    </div>
  );
}
