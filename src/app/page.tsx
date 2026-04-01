'use client';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import StatStrip from '@/components/dashboard/StatStrip';
import StatusBreakdown from '@/components/dashboard/StatusBreakdown';
import IndustryBreakdown from '@/components/dashboard/IndustryBreakdown';
import Link from 'next/link';

export default function Dashboard() {
  const { stats, loading, refreshing, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-8">
          {/* Skeleton header */}
          <div className="h-8 rounded-lg w-48" style={{ background: 'var(--surface-3)' }} />
          {/* Skeleton stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl" style={{ background: 'var(--surface-3)' }} />
            ))}
          </div>
          {/* Skeleton charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl h-64" style={{ background: 'var(--surface-3)' }} />
            <div className="rounded-xl h-64" style={{ background: 'var(--surface-3)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          role="alert"
          className="rounded-xl border p-4 text-sm"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <p className="mb-3">Error loading dashboard: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
            style={{ color: 'var(--brand)' }}
          >
            Retry
          </button>
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

      {/* Page header */}
      <div className="flex items-end justify-between mb-8 animate-fade-up">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--brand)' }}
          >
            Dhimahi Technolabs
          </p>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {refreshing && (
            <span
              className="text-xs animate-pulse"
              style={{ color: 'var(--text-muted)' }}
            >
              Refreshing...
            </span>
          )}
          <Link
            href="/use-cases"
            className="text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded back-link"
          >
            View all use cases →
          </Link>
        </div>
      </div>

      {/* Metric cards */}
      <StatStrip stats={stats} />

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up animate-delay-3">
        <StatusBreakdown stats={stats} />
        <IndustryBreakdown stats={stats} />
      </div>

      {/* Empty state */}
      {stats.totalUseCases === 0 && (
        <div
          className="mt-10 text-center rounded-xl border p-16 animate-fade-up"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div
            className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
            style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}
            aria-hidden="true"
          >
            ✦
          </div>
          <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No use cases yet
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Get started by creating your first use case
          </p>
          <Link
            href="/use-cases/new"
            className="btn-brand inline-block px-5 py-2.5 rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            Create First Use Case
          </Link>
        </div>
      )}
    </div>
  );
}
