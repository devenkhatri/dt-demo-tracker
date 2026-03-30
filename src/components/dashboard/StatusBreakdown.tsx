import { DashboardStats } from '@/lib/types';

interface StatusBreakdownProps {
  stats: DashboardStats;
}

const statusColors = {
  Ready: 'bg-green-100 text-green-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Not Started': 'bg-gray-100 text-gray-800',
};

const statusBars = {
  Ready: 'bg-green-500',
  'In Progress': 'bg-blue-500',
  'Not Started': 'bg-gray-400',
};

export default function StatusBreakdown({ stats }: StatusBreakdownProps) {
  const { byStatus } = stats;
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Demo Status Distribution</h3>

      <div className="space-y-4">
        {Object.entries(byStatus).map(([status, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={status}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{status}</span>
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[status as keyof typeof statusColors]}`}>
                  {count}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${statusBars[status as keyof typeof statusBars]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-6">Total: {total} use cases</p>
    </div>
  );
}
