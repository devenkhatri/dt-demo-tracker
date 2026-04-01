interface StatStripProps {
  stats: {
    totalUseCases: number;
    byStatus: Record<string, number>;
  };
}

const ready = (byStatus: Record<string, number>) => byStatus['Ready'] ?? 0;

export default function StatStrip({ stats }: StatStripProps) {
  const total = stats.totalUseCases;
  const readyCount = ready(stats.byStatus);
  const readyPct = total > 0 ? Math.round((readyCount / total) * 100) : 0;

  const items = [
    {
      label: 'Total Use Cases',
      value: total,
      sub: 'in tracker',
      accent: false,
    },
    {
      label: 'Ready',
      value: readyCount,
      sub: `${readyPct}% of total`,
      accent: true,
    },
    {
      label: 'In Progress',
      value: stats.byStatus['In Progress'] ?? 0,
      sub: 'being built',
      accent: false,
    },
    {
      label: 'Not Started',
      value: stats.byStatus['Not Started'] ?? 0,
      sub: 'in backlog',
      accent: false,
    },
  ];

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-up"
      role="region"
      aria-label="Dashboard statistics"
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`relative rounded-xl border p-5 overflow-hidden animate-fade-up animate-delay-${i + 1}`}
          style={{
            background: item.accent ? 'var(--brand-light)' : 'var(--surface)',
            borderColor: item.accent ? 'var(--brand-muted)' : 'var(--border)',
            boxShadow: item.accent ? 'var(--shadow-brand)' : 'var(--shadow-sm)',
          }}
        >
          {/* Decorative radial glow for accent stat */}
          {item.accent && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, var(--brand-glow), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          )}

          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: item.accent ? 'var(--brand)' : 'var(--text-muted)' }}
          >
            {item.label}
          </p>
          <p
            className="text-4xl font-bold tabular-nums leading-none"
            style={{ color: item.accent ? 'var(--brand)' : 'var(--text-primary)' }}
          >
            {item.value}
          </p>
          <p
            className="text-xs mt-2"
            style={{ color: item.accent ? 'var(--brand-dark)' : 'var(--text-muted)' }}
          >
            {item.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
