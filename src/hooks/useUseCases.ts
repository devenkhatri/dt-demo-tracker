'use client';

import { useEffect, useState, useMemo } from 'react';
import { UseCase, DemoStatus, Industry } from '@/lib/types';

interface FilterState {
  searchQuery: string;
  statusFilter: DemoStatus | null;
  industryFilters: Industry[];
}

export function useUseCases() {
  const [allCases, setAllCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    statusFilter: null,
    industryFilters: [],
  });

  useEffect(() => {
    async function fetchUseCases() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/nocodb/use-cases');

        if (!response.ok) {
          throw new Error('Failed to fetch use cases');
        }

        const data = await response.json();
        const cases: UseCase[] = data.list || data;

        // Parse KeyBenefits for each case
        const parsedCases = cases.map((useCase) => ({
          ...useCase,
          KeyBenefits: typeof useCase.KeyBenefits === 'string'
            ? (() => {
                try {
                  return JSON.parse(useCase.KeyBenefits);
                } catch {
                  return [];
                }
              })()
            : useCase.KeyBenefits,
        }));

        setAllCases(parsedCases);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchUseCases();
  }, []);

  const filteredCases = useMemo(() => {
    let results = [...allCases];

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(
        (useCase) =>
          useCase.Title.toLowerCase().includes(query) ||
          useCase.ProblemStatement.toLowerCase().includes(query) ||
          useCase.SolutionDescription.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filters.statusFilter) {
      results = results.filter((useCase) => useCase.DemoStatus === filters.statusFilter);
    }

    // Filter by industry
    if (filters.industryFilters.length > 0) {
      results = results.filter((useCase) =>
        Array.isArray(useCase.Industry) &&
        useCase.Industry.some((industry) => filters.industryFilters.includes(industry))
      );
    }

    return results;
  }, [allCases, filters]);

  return {
    cases: filteredCases,
    allCases,
    loading,
    error,
    filters,
    setFilters,
    updateSearchQuery: (query: string) =>
      setFilters((prev) => ({ ...prev, searchQuery: query })),
    updateStatusFilter: (status: DemoStatus | null) =>
      setFilters((prev) => ({ ...prev, statusFilter: status })),
    updateIndustryFilters: (industries: Industry[]) =>
      setFilters((prev) => ({ ...prev, industryFilters: industries })),
  };
}
