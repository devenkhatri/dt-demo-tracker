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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 rounded w-2/3" style={{ background: 'var(--border)' }} />
          <div className="h-4 rounded w-1/3" style={{ background: 'var(--border)' }} />
          <div className="h-40 rounded" style={{ background: 'var(--border)' }} />
          <div className="h-40 rounded" style={{ background: 'var(--border)' }} />
        </div>
      </div>
    );
  }

  if (error || !useCase) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          className="rounded-lg p-4 text-sm border mb-4"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          {error || 'Use case not found'}
        </div>
        <Link
          href="/use-cases"
          className="text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
          style={{ color: 'var(--brand)' }}
        >
          ← Back to use cases
        </Link>
      </div>
    );
  }

  const keyBenefits = Array.isArray(useCase.KeyBenefits) ? useCase.KeyBenefits : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <Link
        href="/use-cases"
        className="inline-flex items-center gap-1 text-sm font-medium mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--brand)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)')}
      >
        ← Use Cases
      </Link>

      {/* ── Header ───────────────────────────────────────────── */}
      {/* [P2 /arrange] Single outer container, no per-section card boxing */}
      <div
        className="rounded-lg border p-8"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {useCase.Title}
          </h1>
          <Link
            href={`/use-cases/${useCase.Id}/edit`}
            className="flex-shrink-0 px-3.5 py-1.5 rounded text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            style={{ background: 'var(--brand)', color: '#ffffff' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--brand-dark)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--brand)')}
          >
            Edit
          </Link>
        </div>

        {/* Badge + meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <StatusBadge status={useCase.DemoStatus} />
          {/* [P0 FIX] formatDate now null-safe — falls back to '—' if invalid */}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Created {formatDate(useCase.CreatedAt)} · Updated {formatDate(useCase.UpdatedAt)}
          </span>
        </div>

        {/* Industries */}
        {Array.isArray(useCase.Industry) && useCase.Industry.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {useCase.Industry.map((industry) => (
              <span
                key={industry}
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}
              >
                {industry}
              </span>
            ))}
          </div>
        )}

        {/* ── Problem Statement ──────────────────────────────── */}
        <div className="mt-8 pt-7 border-t" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            Problem Statement
          </h2>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
            {useCase.ProblemStatement}
          </div>
        </div>

        {/* ── Solution ──────────────────────────────────────── */}
        <div className="mt-8 pt-7 border-t" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            Solution
          </h2>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
            {useCase.SolutionDescription}
          </div>
        </div>

        {/* ── Key Benefits ──────────────────────────────────── */}
        {keyBenefits.length > 0 && (
          <div className="mt-8 pt-7 border-t" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Key Benefits
            </h2>
            <ul className="space-y-2">
              {keyBenefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold mt-0.5 flex-shrink-0" style={{ color: 'var(--brand)' }}>✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Costing ───────────────────────────────────────── */}
        {useCase.CostingNotes && (
          <div className="mt-8 pt-7 border-t" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Costing
            </h2>
            <div className="text-sm leading-relaxed whitespace-pre-wrap mb-4" style={{ color: 'var(--text-secondary)' }}>
              {useCase.CostingNotes}
            </div>

            {costComponents.length > 0 && (
              <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: `1px solid var(--border)` }}>
                      <th className="text-left py-2 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        Label
                      </th>
                      <th className="text-right py-2 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        Unit Cost
                      </th>
                      <th className="text-right py-2 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        Qty
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        Frequency
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {costComponents.map((component) => (
                      <tr
                        key={component.Id}
                        className="border-t"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <td className="py-2.5 px-4" style={{ color: 'var(--text-primary)' }}>{component.Label}</td>
                        <td className="text-right py-2.5 px-4 tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                          ${component.UnitCost.toFixed(2)}
                        </td>
                        <td className="text-right py-2.5 px-4 tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                          {component.Quantity}
                        </td>
                        <td className="py-2.5 px-4" style={{ color: 'var(--text-secondary)' }}>{component.Frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Demo Access block sits outside the main card */}
      <div className="mt-6">
        <DemoAccessBlock useCase={useCase} />
      </div>
    </div>
  );
}
