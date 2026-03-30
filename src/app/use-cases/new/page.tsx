import Link from 'next/link';
import UseCaseForm from '@/components/use-cases/UseCaseForm';

export const metadata = {
  title: 'Create Use Case | Demo Tracker',
};

export default function NewUseCasePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/use-cases" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to use cases
      </Link>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Use Case</h1>
        <p className="text-gray-600 mb-8">Fill in the details to create a new use case</p>

        <UseCaseForm />
      </div>
    </div>
  );
}
