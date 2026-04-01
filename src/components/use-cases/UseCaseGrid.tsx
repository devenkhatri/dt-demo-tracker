import { UseCase } from '@/lib/types';
import UseCaseCard from './UseCaseCard';

interface UseCaseGridProps {
  cases: UseCase[];
  loading?: boolean;
}

export default function UseCaseGrid({ cases, loading }: UseCaseGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg h-64 animate-pulse" style={{ background: 'var(--border)' }} />
        ))}
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>No use cases found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases.map((useCase) => (
        <UseCaseCard key={useCase.Id} useCase={useCase} />
      ))}
    </div>
  );
}
