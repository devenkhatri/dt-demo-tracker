import { DemoStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: DemoStatus;
  size?: 'sm' | 'md';
}

const statusStyles: Record<DemoStatus, React.CSSProperties> = {
  Ready: {
    background: 'var(--status-ready-bg)',
    color: 'var(--status-ready)',
    borderColor: 'var(--status-ready-border)',
  },
  'In Progress': {
    background: 'var(--status-progress-bg)',
    color: 'var(--status-progress)',
    borderColor: 'var(--status-progress-border)',
  },
  'Not Started': {
    background: 'var(--status-not-started-bg)',
    color: 'var(--status-not-started)',
    borderColor: 'var(--status-not-started-border)',
  },
};

/** Dot color per status for the leading indicator */
const dotColor: Record<DemoStatus, string> = {
  Ready: 'var(--status-ready)',
  'In Progress': 'var(--status-progress)',
  'Not Started': 'var(--status-not-started)',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const style = statusStyles[status] ?? statusStyles['Not Started'];
  const px = size === 'md' ? 'px-3 py-1' : 'px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${px} rounded-full text-xs font-semibold border w-fit`}
      style={style}
    >
      {/* Leading dot indicator */}
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: dotColor[status] ?? 'var(--text-muted)' }}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}
