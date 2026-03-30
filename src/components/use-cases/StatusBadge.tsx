import { DemoStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: DemoStatus;
}

const statusClasses = {
  Ready: 'bg-green-100 text-green-800 border border-green-300',
  'In Progress': 'bg-blue-100 text-blue-800 border border-blue-300',
  'Not Started': 'bg-gray-100 text-gray-800 border border-gray-300',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
