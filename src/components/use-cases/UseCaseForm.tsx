'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UseCase, Industry, DemoStatus } from '@/lib/types';
import { parseKeyBenefits, stringifyKeyBenefits } from '@/lib/utils';

const INDUSTRIES: Industry[] = [
  'Finance',
  'HR',
  'Retail',
  'Healthcare',
  'Legal',
  'Manufacturing',
  'Education',
  'Real Estate',
  'Insurance',
  'Other',
];

const DEMO_STATUSES: DemoStatus[] = ['Ready', 'In Progress', 'Not Started'];

interface UseCaseFormProps {
  initialData?: UseCase;
  isEditing?: boolean;
}

export default function UseCaseForm({ initialData, isEditing }: UseCaseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');

  const [formData, setFormData] = useState({
    Title: '',
    Industry: [] as Industry[],
    ProblemStatement: '',
    SolutionDescription: '',
    DemoStatus: 'Not Started' as DemoStatus,
    DemoUrl: '',
    DemoAccessInstructions: '',
    CostingNotes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        Title: initialData.Title,
        Industry: Array.isArray(initialData.Industry) ? initialData.Industry : [],
        ProblemStatement: initialData.ProblemStatement,
        SolutionDescription: initialData.SolutionDescription,
        DemoStatus: initialData.DemoStatus,
        DemoUrl: initialData.DemoUrl || '',
        DemoAccessInstructions: initialData.DemoAccessInstructions || '',
        CostingNotes: initialData.CostingNotes,
      });
      setBenefits(parseKeyBenefits(initialData.KeyBenefits));
    }
  }, [initialData]);

  const toggleIndustry = (industry: Industry) => {
    setFormData((prev) => ({
      ...prev,
      Industry: prev.Industry.includes(industry)
        ? prev.Industry.filter((i) => i !== industry)
        : [...prev.Industry, industry],
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits((prev) => [...prev, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.Title.trim()) {
        throw new Error('Title is required');
      }

      const submitData = {
        ...formData,
        KeyBenefits: stringifyKeyBenefits(benefits),
      };

      const url = isEditing
        ? `/api/nocodb/use-cases/${initialData?.Id}`
        : '/api/nocodb/use-cases';

      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to save use case');
      }

      const result = await response.json();
      router.push(`/use-cases/${result.Id || initialData?.Id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.Title}
          onChange={(e) => handleChange('Title', e.target.value)}
          placeholder="Use case title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
      </div>

      {/* Industries */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Industries
        </label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => toggleIndustry(industry)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                formData.Industry.includes(industry)
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Statement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Problem Statement *
        </label>
        <textarea
          value={formData.ProblemStatement}
          onChange={(e) => handleChange('ProblemStatement', e.target.value)}
          placeholder="Describe the problem this use case addresses"
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
      </div>

      {/* Solution Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Solution Description *
        </label>
        <textarea
          value={formData.SolutionDescription}
          onChange={(e) => handleChange('SolutionDescription', e.target.value)}
          placeholder="Describe how this solution addresses the problem"
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
      </div>

      {/* Key Benefits */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Key Benefits
        </label>
        <div className="space-y-2 mb-3">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-800">{benefit}</span>
              <button
                type="button"
                onClick={() => removeBenefit(idx)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
            placeholder="Add a benefit..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={addBenefit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Demo Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Demo Status
        </label>
        <div className="flex gap-2">
          {DEMO_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleChange('DemoStatus', status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                formData.DemoStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Demo URL (only visible when Ready) */}
      {formData.DemoStatus === 'Ready' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Demo URL
            </label>
            <input
              type="url"
              value={formData.DemoUrl}
              onChange={(e) => handleChange('DemoUrl', e.target.value)}
              placeholder="https://demo.example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Demo Access Instructions
            </label>
            <textarea
              value={formData.DemoAccessInstructions}
              onChange={(e) => handleChange('DemoAccessInstructions', e.target.value)}
              placeholder="Steps to access the demo, credentials, etc."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </>
      )}

      {/* Costing Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Costing Notes
        </label>
        <textarea
          value={formData.CostingNotes}
          onChange={(e) => handleChange('CostingNotes', e.target.value)}
          placeholder="Describe the cost structure, pricing, or relevant financial information"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Use Case' : 'Create Use Case'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
