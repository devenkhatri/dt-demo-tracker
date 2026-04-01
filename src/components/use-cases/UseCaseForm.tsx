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

/** Shared input classes — brand tokens, focus-visible ring, no blue-* utilities. */
const inputClass =
  'w-full px-3.5 py-2 rounded-lg text-sm border transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:border-[var(--brand)]';

/** Shared label styles */
const labelStyle: React.CSSProperties = { color: 'var(--text-secondary)' };

const inputStyle: React.CSSProperties = {
  background: 'var(--surface)',
  borderColor: 'var(--border)',
  color: 'var(--text-primary)',
};

/**
 * [P1 /colorize]  All blue-* / gray-* / red-* replaced with brand CSS tokens.
 * [P1 /harden]    focus-visible rings on every interactive element; aria labels added.
 * [P2 /normalize] Consistent label + input sizing throughout.
 */
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

  const handleChange = (field: string, value: unknown) => {
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
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save use case');
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
    <form onSubmit={handleSubmit} className="space-y-8" noValidate aria-label={isEditing ? 'Edit use case form' : 'Create use case form'}>
      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border p-4 text-sm"
          style={{
            background: '#fef2f2',
            borderColor: '#fecaca',
            color: '#991b1b',
          }}
        >
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="uc-title"
          className="block text-sm font-medium mb-2"
          style={labelStyle}
        >
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          id="uc-title"
          type="text"
          value={formData.Title}
          onChange={(e) => handleChange('Title', e.target.value)}
          placeholder="Use case title"
          className={inputClass}
          style={inputStyle}
          required
          aria-required="true"
        />
      </div>

      {/* Industries */}
      <fieldset>
        <legend className="block text-sm font-medium mb-3" style={labelStyle}>
          Industries
        </legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select industries">
          {INDUSTRIES.map((industry) => {
            const active = formData.Industry.includes(industry);
            return (
              <button
                key={industry}
                type="button"
                onClick={() => toggleIndustry(industry)}
                aria-pressed={active}
                className="px-3 py-1.5 rounded text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                style={
                  active
                    ? {
                        background: 'var(--brand-light)',
                        color: 'var(--brand)',
                        borderColor: 'var(--brand-muted)',
                      }
                    : {
                        background: 'var(--surface)',
                        color: 'var(--text-secondary)',
                        borderColor: 'var(--border)',
                      }
                }
              >
                {industry}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Problem Statement */}
      <div>
        <label
          htmlFor="uc-problem"
          className="block text-sm font-medium mb-2"
          style={labelStyle}
        >
          Problem Statement <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="uc-problem"
          value={formData.ProblemStatement}
          onChange={(e) => handleChange('ProblemStatement', e.target.value)}
          placeholder="Describe the problem this use case addresses"
          rows={5}
          className={inputClass}
          style={inputStyle}
          required
          aria-required="true"
        />
      </div>

      {/* Solution Description */}
      <div>
        <label
          htmlFor="uc-solution"
          className="block text-sm font-medium mb-2"
          style={labelStyle}
        >
          Solution Description <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="uc-solution"
          value={formData.SolutionDescription}
          onChange={(e) => handleChange('SolutionDescription', e.target.value)}
          placeholder="Describe how this solution addresses the problem"
          rows={5}
          className={inputClass}
          style={inputStyle}
          required
          aria-required="true"
        />
      </div>

      {/* Key Benefits */}
      <div>
        <p className="block text-sm font-medium mb-3" style={labelStyle}>
          Key Benefits
        </p>
        <div className="space-y-2 mb-3" role="list" aria-label="Added benefits">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              role="listitem"
              className="flex items-center justify-between rounded-lg px-4 py-3"
              style={{ background: 'var(--surface-2)', color: 'var(--text-primary)' }}
            >
              <span className="text-sm flex-1 mr-4">{benefit}</span>
              <button
                type="button"
                onClick={() => removeBenefit(idx)}
                aria-label={`Remove benefit: ${benefit}`}
                className="text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            id="uc-new-benefit"
            type="text"
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addBenefit())
            }
            placeholder="Add a benefit…"
            aria-label="New benefit text"
            className={inputClass}
            style={{ ...inputStyle, maxWidth: 'none' }}
          />
          <button
            type="button"
            onClick={addBenefit}
            aria-label="Add benefit"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            style={{ background: 'var(--brand)', color: '#ffffff' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = 'var(--brand-dark)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = 'var(--brand)')
            }
          >
            Add
          </button>
        </div>
      </div>

      {/* Demo Status */}
      <fieldset>
        <legend className="block text-sm font-medium mb-3" style={labelStyle}>
          Demo Status
        </legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select demo status">
          {DEMO_STATUSES.map((status) => {
            const active = formData.DemoStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleChange('DemoStatus', status)}
                aria-pressed={active}
                className="px-4 py-2 rounded-lg text-sm font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                style={
                  active
                    ? {
                        background: 'var(--brand)',
                        color: '#ffffff',
                        borderColor: 'var(--brand)',
                      }
                    : {
                        background: 'var(--surface)',
                        color: 'var(--text-secondary)',
                        borderColor: 'var(--border)',
                      }
                }
              >
                {status}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Demo URL (only visible when Ready) */}
      {formData.DemoStatus === 'Ready' && (
        <>
          <div>
            <label
              htmlFor="uc-demo-url"
              className="block text-sm font-medium mb-2"
              style={labelStyle}
            >
              Demo URL
            </label>
            <input
              id="uc-demo-url"
              type="url"
              value={formData.DemoUrl}
              onChange={(e) => handleChange('DemoUrl', e.target.value)}
              placeholder="https://demo.example.com"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="uc-demo-access"
              className="block text-sm font-medium mb-2"
              style={labelStyle}
            >
              Demo Access Instructions
            </label>
            <textarea
              id="uc-demo-access"
              value={formData.DemoAccessInstructions}
              onChange={(e) => handleChange('DemoAccessInstructions', e.target.value)}
              placeholder="Steps to access the demo, credentials, etc."
              rows={4}
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </>
      )}

      {/* Costing Notes */}
      <div>
        <label
          htmlFor="uc-costing"
          className="block text-sm font-medium mb-2"
          style={labelStyle}
        >
          Costing Notes
        </label>
        <textarea
          id="uc-costing"
          value={formData.CostingNotes}
          onChange={(e) => handleChange('CostingNotes', e.target.value)}
          placeholder="Describe the cost structure, pricing, or relevant financial information"
          rows={4}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
          className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
          style={{ background: 'var(--brand)', color: '#ffffff' }}
          onMouseEnter={(e) => {
            if (!loading)
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--brand-dark)';
          }}
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = 'var(--brand)')
          }
        >
          {loading ? 'Saving…' : isEditing ? 'Update Use Case' : 'Create Use Case'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)')
          }
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
