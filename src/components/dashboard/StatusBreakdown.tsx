import { DashboardStats } from '@/lib/types';

interface StatusBreakdownProps {
  stats: DashboardStats;
}

const statusConfig = {
  Ready: {
    barFrom: 'var(--brand)',
    barTo:   'var(--brand-muted)',
    badge:   { bg: 'var(--status-ready-bg)', color: 'var(--status-ready)', border: 'var(--status-ready-border)' },
  },
  'In Progress': {
    barFrom: 'var(--brand-muted)',
    barTo:   'var(--border-strong)',
    badge:   { bg: 'var(--status-progress-bg)', color: 'var(--status-progress)', border: 'var(--status-progress-border)' },
  },
  'Not Started': {
    barFrom: 'var(--border-strong)',
    barTo:   'var(--surface-3)',
    badge:   { bg: 'var(--status-not-started-bg)', color: 'var(--status-not-started)', border: 'var(--status-not-started-border)' },
  },
};

export default function StatusBreakdown({ stats }: StatusBreakdownProps) {
  const { byStatus } = stats;
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);

  return (
    <div
      className="rounded-xl border p-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <h3
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Status Distribution
        </h3>
        <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
          {total} total
        </span>
      </div>

      <div className="space-y-5">
        {(Object.entries(byStatus) as [string, number][]).map(([status, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const cfg = statusConfig[status as keyof typeof statusConfig];

          return (
            <div key={status}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {/* Dot indicator */}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: cfg?.barFrom ?? 'var(--brand)',
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {status}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span
                    className="text-xs tabular-nums font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {pct}%
                  </span>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border tabular-nums"
                    style={
                      cfg
                        ? {
                            background: cfg.badge.bg,
                            color: cfg.badge.color,
                            borderColor: cfg.badge.border,
                          }
                        : {
                            background: 'var(--surface-2)',
                            color: 'var(--text-muted)',
                            borderColor: 'var(--border)',
                          }
                    }
                  >
                    {count}
                  </span>
                </div>
              </div>

              {/* Progress bar track */}
              <div
                className="relative w-full h-2 rounded-full overflow-hidden"
                style={{ background: 'var(--surface-2)' }}
              >
                <div
                  className="bar-grow absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: cfg
                      ? `linear-gradient(90deg, ${cfg.barFrom}, ${cfg.barTo})`
                      : 'var(--brand)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
