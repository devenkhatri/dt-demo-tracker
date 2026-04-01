import { DemoStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: DemoStatus;
}

/**
 * [P2 /normalize] Uses inline-flex + w-fit so the badge hugs its label.
 * [P0 /colorize] Uses brand CSS tokens — no more blue-X/green-X hardcoding.
 */
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

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border w-fit"
      style={statusStyles[status] ?? statusStyles['Not Started']}
    >
      {status}
    </span>
  );
}
