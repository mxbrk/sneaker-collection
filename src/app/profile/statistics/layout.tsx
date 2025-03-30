// src/app/profile/statistics/layout.tsx
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function StatisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return <>{children}</>;
}