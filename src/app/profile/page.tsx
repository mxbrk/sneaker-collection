'use client';

import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  username: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/login');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-black/20 rounded-lg shadow-sm border border-black/[.08] dark:border-white/[.08] p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Profile</h1>
            <Button onClick={handleLogout} className="px-6 py-2 w-auto">
              Log out
            </Button>
          </div>

          <div className="space-y-6">
            <div className="bg-black/[.03] dark:bg-white/[.03] rounded-lg p-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Username</h2>
                  <p>{user?.username || 'No username set'}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Email</h2>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">ID</h2>
                  <p className="font-mono text-sm">{user?.id}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <p className="text-foreground/70">
                More account settings and functionality will be added in future updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}