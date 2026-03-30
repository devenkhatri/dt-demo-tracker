import { UseCase } from '@/lib/types';

interface DemoAccessBlockProps {
  useCase: UseCase;
}

export default function DemoAccessBlock({ useCase }: DemoAccessBlockProps) {
  // Only show if status is "Ready"
  if (useCase.DemoStatus !== 'Ready') {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
        <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">
          ✓
        </span>
        Demo Ready
      </h3>

      <div className="space-y-4">
        {useCase.DemoUrl && (
          <div>
            <p className="text-sm text-green-800 font-medium mb-2">Demo URL</p>
            <a
              href={useCase.DemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {useCase.DemoUrl}
            </a>
          </div>
        )}

        {useCase.DemoAccessInstructions && (
          <div>
            <p className="text-sm text-green-800 font-medium mb-2">Access Instructions</p>
            <div className="bg-white rounded p-4 text-sm text-gray-700 whitespace-pre-wrap">
              {useCase.DemoAccessInstructions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
