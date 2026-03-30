import { CostComponent, Frequency } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

const FREQUENCIES: Frequency[] = ['One-time', 'Monthly', 'Annual', 'Per Run'];

interface CostComponentRowProps {
  component: CostComponent;
  onUpdate: (field: string, value: any) => void;
  onDelete: () => void;
}

export default function CostComponentRow({
  component,
  onUpdate,
  onDelete,
}: CostComponentRowProps) {
  const totalCost = (component.UnitCost || 0) * (component.Quantity || 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={component.Label}
            onChange={(e) => onUpdate('Label', e.target.value)}
            placeholder="e.g., OpenAI API calls"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={onDelete}
          className="mt-6 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg font-medium text-sm"
        >
          Delete
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Cost ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={component.UnitCost || ''}
            onChange={(e) => onUpdate('UnitCost', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            step="0.01"
            value={component.Quantity || ''}
            onChange={(e) => onUpdate('Quantity', parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <input
            type="text"
            value={component.Unit}
            onChange={(e) => onUpdate('Unit', e.target.value)}
            placeholder="e.g., per 1000 tokens"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>
          <select
            value={component.Frequency}
            onChange={(e) => onUpdate('Frequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {FREQUENCIES.map((freq) => (
              <option key={freq} value={freq}>
                {freq}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <input
          type="text"
          value={component.Notes || ''}
          onChange={(e) => onUpdate('Notes', e.target.value)}
          placeholder="Optional notes"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="bg-gray-50 rounded p-3 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Total</span>
        <span className="text-lg font-bold text-gray-900">{formatCurrency(totalCost)}</span>
      </div>
    </div>
  );
}
