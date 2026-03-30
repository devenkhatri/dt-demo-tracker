'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UseCase, CostComponent } from '@/lib/types';
import StatusBadge from '@/components/use-cases/StatusBadge';
import DemoAccessBlock from '@/components/use-cases/DemoAccessBlock';
import { formatDate, parseKeyBenefits } from '@/lib/utils';

interface UseCaseDetailProps {
  params: Promise<{ id: string }>;
}

export default function UseCaseDetail({ params }: UseCaseDetailProps) {
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [costComponents, setCostComponents] = useState<CostComponent[]>([]);
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

        // Parse KeyBenefits
        const parsedData = {
          ...data,
          KeyBenefits: parseKeyBenefits(data.KeyBenefits),
        };

        setUseCase(parsedData);
        setCostComponents(data.costComponents || []);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !useCase) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error || 'Use case not found'}
        </div>
        <Link href="/use-cases" className="mt-4 text-blue-600 hover:text-blue-800 inline-block">
          ← Back to use cases
        </Link>
      </div>
    );
  }

  const keyBenefits = Array.isArray(useCase.KeyBenefits) ? useCase.KeyBenefits : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/use-cases" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to use cases
      </Link>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{useCase.Title}</h1>
            <StatusBadge status={useCase.DemoStatus} />
          </div>
          <Link
            href={`/use-cases/${useCase.Id}/edit`}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Edit
          </Link>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          Created {formatDate(useCase.CreatedAt)} • Last updated {formatDate(useCase.UpdatedAt)}
        </div>

        {Array.isArray(useCase.Industry) && useCase.Industry.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Industries</h2>
            <div className="flex flex-wrap gap-2">
              {useCase.Industry.map((industry) => (
                <span
                  key={industry}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Problem Statement */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem Statement</h2>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
          {useCase.ProblemStatement}
        </div>
      </div>

      {/* Solution Description */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Solution</h2>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
          {useCase.SolutionDescription}
        </div>
      </div>

      {/* Key Benefits */}
      {keyBenefits.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Benefits</h2>
          <ul className="space-y-2">
            {keyBenefits.map((benefit, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Costing Notes */}
      {useCase.CostingNotes && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Costing</h2>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {useCase.CostingNotes}
          </div>

          {costComponents.length > 0 && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Components</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">Label</th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-700">Unit Cost</th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-700">Quantity</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costComponents.map((component) => (
                      <tr key={component.Id} className="border-b border-gray-100">
                        <td className="py-2 px-3">{component.Label}</td>
                        <td className="text-right py-2 px-3">${component.UnitCost.toFixed(2)}</td>
                        <td className="text-right py-2 px-3">{component.Quantity}</td>
                        <td className="py-2 px-3">{component.Frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Demo Access */}
      <DemoAccessBlock useCase={useCase} />
    </div>
  );
}
