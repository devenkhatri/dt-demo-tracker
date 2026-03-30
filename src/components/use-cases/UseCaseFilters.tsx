'use client';

import { useCallback } from 'react';
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

export default function UseCaseFilters({
  searchQuery,
  statusFilter,
  industryFilters,
  onSearchChange,
  onStatusChange,
  onIndustryChange,
}: UseCaseFiltersProps) {
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
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-8">
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, problem, or solution..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
        />
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Demo Status
        </label>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(statusFilter === status ? null : status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Industry Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Industries
        </label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((industry) => (
            <button
              key={industry}
              onClick={() => toggleIndustry(industry)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                industryFilters.includes(industry)
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
