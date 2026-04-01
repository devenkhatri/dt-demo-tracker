import Link from 'next/link';
import { UseCase } from '@/lib/types';
import StatusBadge from './StatusBadge';

interface UseCaseCardProps {
  useCase: UseCase;
}

export default function UseCaseCard({ useCase }: UseCaseCardProps) {
  const excerpt =
    useCase.ProblemStatement.substring(0, 130) +
    (useCase.ProblemStatement.length > 130 ? '…' : '');

  return (
    <Link
      href={`/use-cases/${useCase.Id}`}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded-xl"
    >
      <div
        className="card-hover rounded-xl border h-full flex flex-col"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {/* Card header with status badge */}
        <div
          className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <h3
            className="text-sm font-semibold leading-snug line-clamp-2 flex-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {useCase.Title}
          </h3>
          <div className="flex-shrink-0 mt-0.5">
            <StatusBadge status={useCase.DemoStatus} />
          </div>
        </div>

        {/* Excerpt */}
        <p
          className="px-5 py-4 text-sm leading-relaxed line-clamp-3 flex-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {excerpt}
        </p>

        {/* Industry tags */}
        {Array.isArray(useCase.Industry) && useCase.Industry.length > 0 && (
          <div className="px-5 pb-4 flex flex-wrap gap-1.5">
            {useCase.Industry.slice(0, 3).map((industry) => (
              <span
                key={industry}
                className="text-xs px-2.5 py-0.5 rounded-full font-medium border"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--text-muted)',
                  borderColor: 'var(--border)',
                }}
              >
                {industry}
              </span>
            ))}
            {useCase.Industry.length > 3 && (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-medium border"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--text-muted)',
                  borderColor: 'var(--border)',
                }}
              >
                +{useCase.Industry.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Hover arrow indicator */}
        <div
          className="px-5 pb-4 flex items-center gap-1 text-xs font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          <span>View details</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}
