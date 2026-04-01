'use client';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import StatStrip from '@/components/dashboard/StatStrip';
import StatusBreakdown from '@/components/dashboard/StatusBreakdown';
import IndustryBreakdown from '@/components/dashboard/IndustryBreakdown';
import Link from 'next/link';

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-8">
          <div className="h-24 rounded-lg" style={{ background: 'var(--border)' }} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg h-64" style={{ background: 'var(--border)' }} />
            <div className="rounded-lg h-64" style={{ background: 'var(--border)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          className="rounded-lg p-4 text-sm border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* [P2 /distill] Removed redundant subtitle — "Track AI use cases and demo readiness" */}
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        Dashboard
      </h1>

      {/* [P1 /arrange] Inline stat strip — no colored icon squares */}
      <StatStrip stats={stats} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusBreakdown stats={stats} />
        <IndustryBreakdown stats={stats} />
      </div>

      {/* Empty State */}
      {stats.totalUseCases === 0 && (
        <div
          className="mt-10 text-center rounded-lg border p-12"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No use cases yet
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Get started by creating your first use case
          </p>
          <Link
            href="/use-cases/new"
            className="inline-block px-5 py-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            style={{ background: 'var(--brand)', color: '#ffffff' }}
          >
            Create First Use Case
          </Link>
        </div>
      )}
    </div>
  );
}
