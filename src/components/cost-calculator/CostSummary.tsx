import { formatCurrency } from '@/lib/utils';

interface CostSummaryProps {
  monthly: number;
  annual: number;
  oneTime: number;
}

export default function CostSummary({ monthly, annual, oneTime }: CostSummaryProps) {
  const totalAnnual = monthly * 12 + annual + oneTime;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-600 font-medium mb-1">Monthly Recurring</p>
        <p className="text-2xl font-bold text-blue-900">{formatCurrency(monthly)}</p>
      </div>

      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
        <p className="text-sm text-orange-600 font-medium mb-1">Annual Recurring</p>
        <p className="text-2xl font-bold text-orange-900">{formatCurrency(annual)}</p>
      </div>

      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <p className="text-sm text-green-600 font-medium mb-1">One-time Setup</p>
        <p className="text-2xl font-bold text-green-900">{formatCurrency(oneTime)}</p>
      </div>

      <div className="md:col-span-3 bg-purple-50 rounded-lg p-4 border border-purple-200">
        <p className="text-sm text-purple-600 font-medium mb-1">Total Annual Cost</p>
        <p className="text-3xl font-bold text-purple-900">{formatCurrency(totalAnnual)}</p>
      </div>
    </div>
  );
}
