import { useState } from 'react';
import { UseCase } from '@/lib/types';

interface DemoAccessBlockProps {
  useCase: UseCase;
}

/**
 * [P1 /colorize]  All green-* / blue-* / gray-* replaced with brand tokens.
 * [P1 /harden]    focus-visible ring on the demo-url link; aria-label on section.
 * [P3 /delight]   Copy-to-clipboard for demo URLs.
 */
export default function DemoAccessBlock({ useCase }: DemoAccessBlockProps) {
  const [copied, setCopied] = useState(false);

  if (useCase.DemoStatus !== 'Ready') {
    return null;
  }

  const handleCopyUrl = async () => {
    if (!useCase.DemoUrl) return;
    try {
      await navigator.clipboard.writeText(useCase.DemoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
    }
  };

  return (
    <section
      aria-label="Demo access information"
      className="rounded-lg border p-6 mt-6"
      style={{
        background: 'var(--status-ready-bg)',
        borderColor: 'var(--status-ready-border)',
      }}
    >
      <h3
        className="text-base font-semibold mb-4 flex items-center gap-2"
        style={{ color: 'var(--status-ready)' }}
      >
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
          style={{ background: 'var(--status-ready)' }}
          aria-hidden="true"
        >
          ✓
        </span>
        Demo Ready
      </h3>

      <div className="space-y-4">
        {useCase.DemoUrl && (
          <div>
            <p
              className="text-sm font-medium mb-1.5"
              style={{ color: 'var(--status-ready)' }}
            >
              Demo URL
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={useCase.DemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open demo: ${useCase.DemoUrl}`}
                className="text-sm underline underline-offset-2 break-all transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
                style={{ color: 'var(--brand)' }}
              >
                {useCase.DemoUrl}
              </a>
              <button
                onClick={handleCopyUrl}
                aria-label={copied ? 'Copied!' : 'Copy demo URL'}
                className="text-xs px-2 py-1 rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                style={{
                  background: copied ? 'var(--status-ready)' : 'var(--surface)',
                  borderColor: copied ? 'var(--status-ready)' : 'var(--border)',
                  color: copied ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {useCase.DemoAccessInstructions && (
          <div>
            <p
              className="text-sm font-medium mb-1.5"
              style={{ color: 'var(--status-ready)' }}
            >
              Access Instructions
            </p>
            <div
              className="rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
              }}
            >
              {useCase.DemoAccessInstructions}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
