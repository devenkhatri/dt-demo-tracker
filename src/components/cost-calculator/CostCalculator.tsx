'use client';

import { useState } from 'react';
import { useCostCalculator } from '@/hooks/useCostCalculator';
import CostComponentRow from './CostComponentRow';
import CostSummary from './CostSummary';
import { CostComponent, Frequency } from '@/lib/types';

interface CostCalculatorProps {
  useCaseId: number | string;
}

export default function CostCalculator({ useCaseId }: CostCalculatorProps) {
  const {
    components,
    loading,
    error,
    updateComponent,
    addComponent,
    deleteComponent,
    calculateSummary,
  } = useCostCalculator(useCaseId);

  const [showNewForm, setShowNewForm] = useState(false);
  const [newComponent, setNewComponent] = useState<Omit<CostComponent, 'Id'>>({
    UseCaseId: Number(useCaseId),
    Label: '',
    UnitCost: 0,
    Quantity: 0,
    Unit: '',
    Frequency: 'Monthly' as Frequency,
    Notes: '',
  });

  const handleAddComponent = () => {
    if (newComponent.Label.trim()) {
      addComponent(newComponent);
      setNewComponent({
        UseCaseId: Number(useCaseId),
        Label: '',
        UnitCost: 0,
        Quantity: 0,
        Unit: '',
        Frequency: 'Monthly',
        Notes: '',
      });
      setShowNewForm(false);
    }
  };

  const summary = calculateSummary();

  if (loading) {
    return <div className="animate-pulse h-48 bg-gray-200 rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cost Breakdown</h2>
        <CostSummary
          monthly={summary.monthly}
          annual={summary.annual}
          oneTime={summary.oneTime}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cost Components</h3>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {showNewForm ? 'Cancel' : 'Add Component'}
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
            {error}
          </div>
        )}

        {showNewForm && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={newComponent.Label}
                onChange={(e) =>
                  setNewComponent({ ...newComponent, Label: e.target.value })
                }
                placeholder="e.g., OpenAI API calls"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newComponent.UnitCost}
                  onChange={(e) =>
                    setNewComponent({
                      ...newComponent,
                      UnitCost: parseFloat(e.target.value) || 0,
                    })
                  }
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
                  value={newComponent.Quantity}
                  onChange={(e) =>
                    setNewComponent({
                      ...newComponent,
                      Quantity: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleAddComponent}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Cost Component
            </button>
          </div>
        )}

        {components.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No cost components added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {components.map((component) => (
              <CostComponentRow
                key={component.Id}
                component={component}
                onUpdate={(field, value) => updateComponent(component.Id, field, value)}
                onDelete={() => deleteComponent(component.Id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
