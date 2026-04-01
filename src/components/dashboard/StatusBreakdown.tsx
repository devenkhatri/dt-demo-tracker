import { DashboardStats } from '@/lib/types';

interface StatusBreakdownProps {
  stats: DashboardStats;
}

const statusConfig = {
  Ready: {
    bar: 'var(--brand)',
    badge: { bg: 'var(--status-ready-bg)', color: 'var(--status-ready)', border: 'var(--status-ready-border)' },
  },
  'In Progress': {
    bar: 'var(--brand-muted)',
    badge: { bg: 'var(--status-progress-bg)', color: 'var(--status-progress)', border: 'var(--status-progress-border)' },
  },
  'Not Started': {
    bar: 'var(--border-strong)',
    badge: { bg: 'var(--status-not-started-bg)', color: 'var(--status-not-started)', border: 'var(--status-not-started-border)' },
  },
};

export default function StatusBreakdown({ stats }: StatusBreakdownProps) {
  const { byStatus } = stats;
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);

  return (
    <div
      className="rounded-lg border p-6"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
        Status Distribution
      </h3>

      <div className="space-y-5">
        {(Object.entries(byStatus) as [string, number][]).map(([status, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const cfg = statusConfig[status as keyof typeof statusConfig];

          return (
            <div key={status}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {status}
                </span>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border"
                  style={cfg ? {
                    background: cfg.badge.bg,
                    color: cfg.badge.color,
                    borderColor: cfg.badge.border,
                  } : { background: 'var(--surface-2)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}
                >
                  {count}
                </span>
              </div>
              <div className="w-full rounded-full h-1.5" style={{ background: 'var(--border)' }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%`, background: cfg?.bar ?? 'var(--brand)' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
        {total} use cases total
      </p>
    </div>
  );
}
