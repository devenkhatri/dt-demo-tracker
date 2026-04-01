import Link from 'next/link';
import { UseCase } from '@/lib/types';
import StatusBadge from './StatusBadge';

interface UseCaseCardProps {
  useCase: UseCase;
}

export default function UseCaseCard({ useCase }: UseCaseCardProps) {
  const excerpt =
    useCase.ProblemStatement.substring(0, 120) +
    (useCase.ProblemStatement.length > 120 ? '...' : '');

  return (
    <Link
      href={`/use-cases/${useCase.Id}`}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded-lg"
    >
      <div
        className="rounded-lg border p-5 cursor-pointer h-full flex flex-col transition-all duration-150 hover:shadow-md"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--brand-muted)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)')}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold line-clamp-2 flex-1" style={{ color: 'var(--text-primary)' }}>
            {useCase.Title}
          </h3>
        </div>

        <StatusBadge status={useCase.DemoStatus} />

        <p className="text-sm mt-3 flex-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {excerpt}
        </p>

        {Array.isArray(useCase.Industry) && useCase.Industry.length > 0 && (
          <div
            className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            {useCase.Industry.slice(0, 3).map((industry) => (
              <span
                key={industry}
                className="text-xs px-2 py-0.5 rounded font-medium"
                style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}
              >
                {industry}
              </span>
            ))}
            {useCase.Industry.length > 3 && (
              <span
                className="text-xs px-2 py-0.5 rounded font-medium"
                style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
              >
                +{useCase.Industry.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
