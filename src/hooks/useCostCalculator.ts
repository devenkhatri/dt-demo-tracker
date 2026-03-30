'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { CostComponent } from '@/lib/types';

interface CostSummary {
  monthly: number;
  annual: number;
  oneTime: number;
}

export function useCostCalculator(useCaseId: number | string) {
  const [components, setComponents] = useState<CostComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch cost components on mount
  useEffect(() => {
    async function fetchComponents() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/nocodb/cost-components?useCaseId=${useCaseId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch cost components');
        }

        const data = await response.json();
        setComponents(data.list || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchComponents();
  }, [useCaseId]);

  // Auto-save with debounce
  const autoSave = useCallback(
    async (newComponents: CostComponent[]) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          // Save each component
          for (const component of newComponents) {
            if (component.Id) {
              // Update existing
              await fetch(`/api/nocodb/cost-components/${component.Id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(component),
              });
            } else {
              // Create new
              await fetch('/api/nocodb/cost-components', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...component,
                  UseCaseId: useCaseId,
                }),
              });
            }
          }
        } catch (err) {
          console.error('Failed to save cost components:', err);
        }
      }, 2000); // 2 second debounce
    },
    [useCaseId]
  );

  const updateComponent = useCallback(
    (id: number, field: string, value: any) => {
      const newComponents = components.map((comp) =>
        comp.Id === id ? { ...comp, [field]: value } : comp
      );
      setComponents(newComponents);
      autoSave(newComponents);
    },
    [components, autoSave]
  );

  const addComponent = useCallback(
    (component: Omit<CostComponent, 'Id'>) => {
      const newComponent: CostComponent = {
        ...component,
        Id: Date.now(), // Temporary ID, will be replaced by server
        UseCaseId: Number(useCaseId),
      };
      const newComponents = [...components, newComponent];
      setComponents(newComponents);
      autoSave(newComponents);
    },
    [components, useCaseId, autoSave]
  );

  const deleteComponent = useCallback(
    async (id: number) => {
      const newComponents = components.filter((comp) => comp.Id !== id);
      setComponents(newComponents);

      // If it's a real component with a server ID, delete it
      if (id > 0 && id < Date.now() - 100000) {
        try {
          await fetch(`/api/nocodb/cost-components/${id}`, {
            method: 'DELETE',
          });
        } catch (err) {
          console.error('Failed to delete cost component:', err);
        }
      }
    },
    [components]
  );

  const calculateSummary = useCallback((): CostSummary => {
    const summary: CostSummary = {
      monthly: 0,
      annual: 0,
      oneTime: 0,
    };

    components.forEach((component) => {
      const cost = (component.UnitCost || 0) * (component.Quantity || 0);

      switch (component.Frequency) {
        case 'Monthly':
          summary.monthly += cost;
          break;
        case 'Annual':
          summary.annual += cost;
          break;
        case 'One-time':
          summary.oneTime += cost;
          break;
        case 'Per Run':
          // Per run costs are typically monthly equivalent based on avg runs
          summary.monthly += cost;
          break;
      }
    });

    return summary;
  }, [components]);

  return {
    components,
    loading,
    error,
    updateComponent,
    addComponent,
    deleteComponent,
    calculateSummary,
  };
}
