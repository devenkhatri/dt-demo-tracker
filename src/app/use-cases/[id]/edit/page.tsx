'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UseCase } from '@/lib/types';
import UseCaseForm from '@/components/use-cases/UseCaseForm';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

// [P1 /colorize]  Replaced blue/gray/red Tailwind classes with brand tokens.
// [P2 /distill]   Back link now shows the use case title instead of generic copy.
export default function EditUseCasePage({ params }: EditPageProps) {
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolved) => setId(resolved.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function fetchUseCase() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/nocodb/use-cases/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch use case');
        }

        const data = await response.json();
        setUseCase(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchUseCase();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded w-1/3" style={{ background: 'var(--border)' }} />
          <div className="h-64 rounded" style={{ background: 'var(--border)' }} />
        </div>
      </div>
    );
  }

  if (error || !useCase) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/use-cases"
          className="inline-flex items-center gap-1 text-sm font-medium mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--brand)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)')
          }
        >
          ← Use Cases
        </Link>
        <div
          role="alert"
          className="rounded-lg border p-4 text-sm"
          style={{
            background: 'var(--status-error-bg)',
            borderColor: 'var(--status-error-border)',
            color: 'var(--status-error)',
          }}
        >
          {error || 'Use case not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/use-cases/${id}`}
        className="inline-flex items-center gap-1 text-sm font-medium mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--brand)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)')
        }
      >
        ← {useCase.Title}
      </Link>

      <div
        className="rounded-lg border p-8"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <h1
          className="text-2xl font-bold mb-8"
          style={{ color: 'var(--text-primary)' }}
        >
          Edit Use Case
        </h1>

        <UseCaseForm initialData={useCase} isEditing={true} />
      </div>
    </div>
  );
}
