import { DashboardStats } from '@/lib/types';

interface IndustryBreakdownProps {
  stats: DashboardStats;
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

export default function IndustryBreakdown({ stats }: IndustryBreakdownProps) {
  const { byIndustry } = stats;
  const industries = Object.entries(byIndustry)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Use Cases by Industry</h3>

      {industries.length === 0 ? (
        <p className="text-gray-500 text-sm">No use cases yet</p>
      ) : (
        <div className="space-y-3">
          {industries.map(([industry, count]) => (
            <div key={industry} className="flex items-center justify-between">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${industryColors[industry] || 'bg-gray-100 text-gray-800'}`}>
                {industry}
              </span>
              <span className="text-lg font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
