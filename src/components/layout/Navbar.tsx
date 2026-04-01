'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center gap-7">
            {/* Logo / Wordmark */}
            <Link
              href="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
              aria-label="Demo Tracker home"
            >
              <div
                className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--brand)' }}
              >
                <span className="text-white text-xs font-bold tracking-tight">DT</span>
              </div>
              <span className="font-semibold text-sm hidden sm:inline" style={{ color: 'var(--text-primary)' }}>
                Demo Tracker
              </span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex gap-0.5">
              <Link
                href="/"
                aria-current={pathname === '/' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] ${
                  pathname === '/'
                    ? 'font-semibold'
                    : ''
                }`}
                style={
                  pathname === '/'
                    ? { background: 'var(--brand-light)', color: 'var(--brand)' }
                    : { color: 'var(--text-secondary)' }
                }
                onMouseEnter={(e) => {
                  if (pathname !== '/') {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== '/') {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  }
                }}
              >
                Dashboard
              </Link>
              <Link
                href="/use-cases"
                aria-current={isActive('/use-cases') ? 'page' : undefined}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] ${
                  isActive('/use-cases')
                    ? 'font-semibold'
                    : ''
                }`}
                style={
                  isActive('/use-cases')
                    ? { background: 'var(--brand-light)', color: 'var(--brand)' }
                    : { color: 'var(--text-secondary)' }
                }
                onMouseEnter={(e) => {
                  if (!isActive('/use-cases')) {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/use-cases')) {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  }
                }}
              >
                Use Cases
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <Link
              href="/use-cases/new"
              className="px-3.5 py-1.5 rounded text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
              style={{ background: 'var(--brand)', color: '#ffffff' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--brand-dark)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--brand)')}
            >
              + New Use Case
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
