'use client';

import Navbar from '@/components/Navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow relative">
        {children}
      </main>
    </div>
  );
}