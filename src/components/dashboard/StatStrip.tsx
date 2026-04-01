/**
 * [P1 /arrange] Inline stat strip — replaces the 3-card hero metric anti-pattern.
 * Linear-style: compact single row, no colored icon squares, numbers speak for themselves.
 */
interface StatStripProps {
  stats: {
    totalUseCases: number;
    byStatus: Record<string, number>;
  };
}

export default function StatStrip({ stats }: StatStripProps) {
  const items = [
    { label: 'Total', value: stats.totalUseCases },
    { label: 'Ready', value: stats.byStatus['Ready'] ?? 0, accent: true },
    { label: 'In Progress', value: stats.byStatus['In Progress'] ?? 0 },
    { label: 'Not Started', value: stats.byStatus['Not Started'] ?? 0 },
  ];

  return (
    <div
      className="flex items-center gap-0 rounded-lg overflow-hidden border mb-10"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      role="region"
      aria-label="Dashboard statistics"
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex flex-col px-6 py-4 flex-1 ${i > 0 ? 'border-l' : ''}`}
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            {item.label}
          </span>
          <span
            className="text-3xl font-bold tabular-nums mt-1"
            style={{ color: item.accent ? 'var(--brand)' : 'var(--text-primary)' }}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
