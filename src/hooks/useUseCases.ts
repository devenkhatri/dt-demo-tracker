'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { UseCase, DemoStatus, Industry } from '@/lib/types';

interface FilterState {
  searchQuery: string;
  statusFilter: DemoStatus | null;
  industryFilters: Industry[];
}

function parseKeyBenefitsFromUseCase(useCase: UseCase): UseCase {
  return {
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
  };
}

export function useUseCases() {
  const [allCases, setAllCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    statusFilter: null,
    industryFilters: [],
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchUseCases = useCallback(async (isAutoRefresh = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (!isAutoRefresh) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      const response = await fetch('/api/nocodb/use-cases', {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch use cases');
      }

      const data = await response.json();
      const cases: UseCase[] = data.list || data;
      const parsedCases = cases.map(parseKeyBenefitsFromUseCase);

      setAllCases(parsedCases);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      if (!isAutoRefresh) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchUseCases(false);
    const intervalId = setInterval(() => fetchUseCases(true), 30000);
    return () => {
      clearInterval(intervalId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchUseCases]);

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
    refreshing,
    error,
    filters,
    setFilters,
    refresh: () => fetchUseCases(false),
    updateSearchQuery: (query: string) =>
      setFilters((prev) => ({ ...prev, searchQuery: query })),
    updateStatusFilter: (status: DemoStatus | null) =>
      setFilters((prev) => ({ ...prev, statusFilter: status })),
    updateIndustryFilters: (industries: Industry[]) =>
      setFilters((prev) => ({ ...prev, industryFilters: industries })),
  };
}
