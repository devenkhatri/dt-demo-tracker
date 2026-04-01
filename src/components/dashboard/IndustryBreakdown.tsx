import { DashboardStats } from '@/lib/types';

interface IndustryBreakdownProps {
  stats: DashboardStats;
}

export default function IndustryBreakdown({ stats }: IndustryBreakdownProps) {
  const { byIndustry } = stats;
  const industries = Object.entries(byIndustry)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const max = industries[0]?.[1] ?? 1;

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
          By Industry
        </h3>
        <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
          top {industries.length}
        </span>
      </div>

      {industries.length === 0 ? (
        <p className="text-sm py-6 text-center" style={{ color: 'var(--text-muted)' }}>
          No industry data yet
        </p>
      ) : (
        <div className="space-y-3.5">
          {industries.map(([industry, count], idx) => {
            const pct = Math.round((count / max) * 100);
            // Progressively lighter opacity for ranked items
            const opacity = Math.max(0.45, 1 - idx * 0.07);
            return (
              <div key={industry} className="flex items-center gap-3">
                <span
                  className="text-sm font-medium w-28 flex-shrink-0 truncate"
                  style={{ color: 'var(--text-secondary)' }}
                  title={industry}
                >
                  {industry}
                </span>

                <div
                  className="relative flex-1 h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <div
                    className="bar-grow absolute left-0 top-0 h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: 'var(--brand)',
                      opacity,
                    }}
                  />
                </div>

                <span
                  className="text-sm tabular-nums font-semibold w-5 text-right flex-shrink-0"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
