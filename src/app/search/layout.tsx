// src/app/search/layout.tsx
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current user - this is a server component, so it will run on the server
  const user = await getCurrentUser();

  // If there's no user, redirect to login
  if (!user) {
    redirect('/login');
  }

  return <>{children}</>;
}