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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Use Cases</h1>
        <p className="text-gray-600 mt-2">Browse and manage all AI use cases</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
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

      <div>
        <p className="text-sm text-gray-600 mb-4">
          Showing {cases.length} {cases.length === 1 ? 'use case' : 'use cases'}
        </p>
        <UseCaseGrid cases={cases} loading={loading} />
      </div>
    </div>
  );
}
