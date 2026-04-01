import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import { ToastProvider } from '@/components/ui/ToastContext';
import ToastContainer from '@/components/ui/ToastContainer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Demo Tracker',
  description: 'Track AI use cases and demo readiness',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="skip-link sr-only"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="min-h-screen">
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </main>
      </body>
    </html>
  );
}
