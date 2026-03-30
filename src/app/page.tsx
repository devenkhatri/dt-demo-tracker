'use client';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import StatCard from '@/components/dashboard/StatCard';
import StatusBreakdown from '@/components/dashboard/StatusBreakdown';
import IndustryBreakdown from '@/components/dashboard/IndustryBreakdown';
import Link from 'next/link';

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 rounded-lg h-64" />
            <div className="bg-gray-200 rounded-lg h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Track AI use cases and demo readiness</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          label="Total Use Cases"
          value={stats.totalUseCases}
          color="blue"
        />
        <StatCard
          label="Ready for Demo"
          value={stats.byStatus.Ready}
          color="green"
        />
        <StatCard
          label="In Progress"
          value={stats.byStatus['In Progress']}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusBreakdown stats={stats} />
        <IndustryBreakdown stats={stats} />
      </div>

      {/* Empty State */}
      {stats.totalUseCases === 0 && (
        <div className="mt-12 text-center bg-white rounded-lg shadow p-12 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No use cases yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first use case</p>
          <Link
            href="/use-cases/new"
            className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Create First Use Case
          </Link>
        </div>
      )}
    </div>
  );
}
