import Link from 'next/link';
import { UseCase } from '@/lib/types';
import StatusBadge from './StatusBadge';

interface UseCaseCardProps {
  useCase: UseCase;
}

const industryColors: { [key: string]: string } = {
  Finance: 'bg-blue-100 text-blue-800',
  HR: 'bg-cyan-100 text-cyan-800',
  Retail: 'bg-green-100 text-green-800',
  Healthcare: 'bg-red-100 text-red-800',
  Legal: 'bg-purple-100 text-purple-800',
  Manufacturing: 'bg-orange-100 text-orange-800',
  Education: 'bg-yellow-100 text-yellow-800',
  'Real Estate': 'bg-pink-100 text-pink-800',
  Insurance: 'bg-indigo-100 text-indigo-800',
  Other: 'bg-gray-100 text-gray-800',
};

export default function UseCaseCard({ useCase }: UseCaseCardProps) {
  const excerpt = useCase.ProblemStatement.substring(0, 120) + (useCase.ProblemStatement.length > 120 ? '...' : '');

  return (
    <Link href={`/use-cases/${useCase.Id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 p-6 cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">{useCase.Title}</h3>
        </div>

        <StatusBadge status={useCase.DemoStatus} />

        <p className="text-gray-600 text-sm mt-4 flex-1 line-clamp-2">{excerpt}</p>

        {Array.isArray(useCase.Industry) && useCase.Industry.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            {useCase.Industry.slice(0, 3).map((industry) => (
              <span
                key={industry}
                className={`text-xs px-2 py-1 rounded font-medium ${
                  industryColors[industry] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {industry}
              </span>
            ))}
            {useCase.Industry.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded font-medium">
                +{useCase.Industry.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
