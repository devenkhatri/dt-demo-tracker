'use client';

import { useToast } from './ToastContext';

const toastStyles = {
  success: {
    background: 'var(--status-ready-bg)',
    borderColor: 'var(--status-ready-border)',
    color: 'var(--status-ready)',
  },
  error: {
    background: 'var(--status-error-bg)',
    borderColor: 'var(--status-error-border)',
    color: 'var(--status-error)',
  },
  info: {
    background: 'var(--status-progress-bg)',
    borderColor: 'var(--status-progress-border)',
    color: 'var(--status-progress)',
  },
};

const icons = {
  success: '✓',
  error: '✕',
  info: '○',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className="flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium shadow-lg animate-fade-up"
          style={toastStyles[toast.type]}
        >
          <span aria-hidden="true">{icons[toast.type]}</span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-xs font-semibold opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}