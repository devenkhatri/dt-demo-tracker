'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UseCase } from '@/lib/types';
import UseCaseForm from '@/components/use-cases/UseCaseForm';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

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
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !useCase) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/use-cases" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Back to use cases
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error || 'Use case not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/use-cases/${id}`} className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to use case
      </Link>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Use Case</h1>
        <p className="text-gray-600 mb-8">{useCase.Title}</p>

        <UseCaseForm initialData={useCase} isEditing={true} />
      </div>
    </div>
  );
}
