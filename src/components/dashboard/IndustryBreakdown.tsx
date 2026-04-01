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
      className="rounded-lg border p-6"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
        By Industry
      </h3>

      {industries.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          No industry data yet
        </p>
      ) : (
        <div className="space-y-3">
          {industries.map(([industry, count]) => (
            <div key={industry} className="flex items-center gap-3">
              <span
                className="text-sm font-medium w-28 flex-shrink-0 truncate"
                style={{ color: 'var(--text-secondary)' }}
                title={industry}
              >
                {industry}
              </span>
              <div className="flex-1 rounded-full h-1.5" style={{ background: 'var(--border)' }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(count / max) * 100}%`, background: 'var(--brand)' }}
                />
              </div>
              <span
                className="text-sm tabular-nums font-semibold w-4 text-right flex-shrink-0"
                style={{ color: 'var(--text-primary)' }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
