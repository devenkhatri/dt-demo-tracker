/** [P1 /colorize] Brand tokens replace colorClasses map (StatCard is a legacy fallback; StatStrip is the primary). */
interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  accent?: boolean;
}

export default function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div
      className="rounded-lg border p-6"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {icon && (
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white text-sm"
          style={{ background: accent ? 'var(--brand)' : 'var(--surface-2)' }}
        >
          {icon}
        </div>
      )}
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p
        className="text-3xl font-bold tabular-nums mt-1"
        style={{ color: accent ? 'var(--brand)' : 'var(--text-primary)' }}
      >
        {value}
      </p>
    </div>
  );
}
