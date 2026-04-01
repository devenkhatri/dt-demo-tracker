import { UseCase } from '@/lib/types';
import UseCaseCard from './UseCaseCard';

interface UseCaseGridProps {
  cases: UseCase[];
  loading?: boolean;
}

export default function UseCaseGrid({ cases, loading }: UseCaseGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl h-56 animate-pulse"
            style={{ background: 'var(--surface-2)' }}
          />
        ))}
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div
        className="text-center py-20 rounded-xl border"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-xl"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
          aria-hidden="true"
        >
          ◎
        </div>
        <p className="text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          No use cases found
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {cases.map((useCase) => (
        <UseCaseCard key={useCase.Id} useCase={useCase} />
      ))}
    </div>
  );
}
