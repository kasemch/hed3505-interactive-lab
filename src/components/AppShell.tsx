import type { ReactNode } from 'react';
import { Header } from './Header';
import { StepNavigation } from './StepNavigation';
import { Footer } from './Footer';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-lightgray)]">
      <Header />
      <StepNavigation />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
