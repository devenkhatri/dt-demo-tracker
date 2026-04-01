import Link from 'next/link';
import UseCaseForm from '@/components/use-cases/UseCaseForm';

export const metadata = {
  title: 'Create Use Case | Demo Tracker',
};

// [P1 /colorize]  Replaced bg-white/shadow/gray/blue Tailwind classes with brand tokens.
// [P2 /distill]   Removed redundant subtitle.
export default function NewUseCasePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/use-cases"
        className="back-link inline-flex items-center gap-1 text-sm font-medium mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
      >
        ← Use Cases
      </Link>

      <div
        className="rounded-lg border p-8"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <h1
          className="text-2xl font-bold mb-8"
          style={{ color: 'var(--text-primary)' }}
        >
          Create New Use Case
        </h1>

        <UseCaseForm />
      </div>
    </div>
  );
}
