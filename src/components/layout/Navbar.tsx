'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path);

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Top brand accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, var(--brand), var(--brand-muted), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center gap-6">
            {/* Logo / Wordmark */}
            <Link
              href="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded"
              aria-label="Demo Tracker home"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
                  boxShadow: '0 2px 8px var(--brand-glow), 0 0 0 1px rgba(33,91,111,0.15)',
                }}
              >
                <span
                  className="text-white text-xs font-bold tracking-tight"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  DT
                </span>
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Demo Tracker
                </span>
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  Dhimahi Technolabs
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-0.5">
              {[
                { href: '/', label: 'Dashboard', exact: true },
                { href: '/use-cases', label: 'Use Cases', exact: false },
              ].map(({ href, label, exact }) => {
                const active = exact ? pathname === href : isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className="relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                    style={
                      active
                        ? {
                            background: 'var(--brand-light)',
                            color: 'var(--brand)',
                          }
                        : { color: 'var(--text-secondary)' }
                    }
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)';
                        (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                      }
                    }}
                  >
                    {label}
                    {active && (
                      <span
                        className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full"
                        style={{ background: 'var(--brand)' }}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            <Link
              href="/use-cases/new"
              className="btn-brand px-3.5 py-1.5 rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
            >
              + New Use Case
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
