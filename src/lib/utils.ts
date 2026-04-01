// Utility functions for Demo Tracker

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseKeyBenefits(input: string | string[] | undefined): string[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If not JSON, try splitting by comma or newline
      return input
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
  }

  return [];
}

export function stringifyKeyBenefits(benefits: string[]): string {
  return JSON.stringify(benefits);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * [P0 FIX] Null-safe date formatting.
 * Falls back to '—' if the value is missing, invalid, or not parseable.
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
