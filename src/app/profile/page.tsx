'use client';

import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
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

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d14124] border-r-transparent"></div>
          <p className="mt-2 text-[#737373]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-[#e5e5e5] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-[#d14124]">
              Sneaker Collection
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="text-[#171717] px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-[#171717] px-3 py-2 rounded-md text-sm font-medium"
              >
                Search
              </Link>
              <Link
                href="/profile"
                className="bg-[#fae5e1] text-[#d14124] px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Hero Section */}
        <div className="relative bg-gradient-to-r from-[#fae5e1] to-[#fcf5f3] rounded-2xl overflow-hidden mb-10">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path fill="#d14124" d="M42.8,-68.2C56.9,-61.3,70.5,-52.1,78.3,-39.4C86.2,-26.7,88.2,-10.4,84.6,4.3C81.1,19,72,32.2,61.3,41.8C50.6,51.4,38.2,57.3,25.3,60.9C12.3,64.4,-1.2,65.5,-14.3,63.1C-27.4,60.7,-40.1,54.8,-49.4,45.5C-58.7,36.1,-64.5,23.3,-69.1,9.1C-73.8,-5.1,-77.3,-20.6,-71.5,-31.6C-65.8,-42.6,-50.6,-49.2,-36.9,-56C-23.1,-62.9,-11.6,-70,2.2,-73.5C15.9,-77,31.8,-76.9,42.8,-68.2Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 relative z-10">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-36 h-36 md:w-40 md:h-40 rounded-full bg-[#d14124] flex items-center justify-center text-white text-5xl font-bold shadow-lg ring-4 ring-white">
                {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute bottom-0 right-0 bg-white text-[#d14124] rounded-full p-2 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <path d="M20 8v6"></path>
                  <path d="M23 11h-6"></path>
                </svg>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 flex flex-col items-center md:items-start">
              <h1 className="text-3xl font-bold text-[#171717]">
                {user?.username || 'User'}
              </h1>
              <p className="text-[#737373] mt-1">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US",{
                  year: "numeric",
                  month: "long"
                }) : 'Unknown'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/profile/settings" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e5e5] rounded-lg text-[#171717] hover:bg-[#f8f8f8] transition shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e5e5] rounded-lg text-[#171717] hover:bg-[#f8f8f8] transition shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#171717]">Collection</h3>
              <span className="text-[#d14124] bg-[#fae5e1] rounded-full w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">0</span>
              <p className="text-[#737373] mt-1 text-sm">Total sneakers</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#171717]">Wishlist</h3>
              <span className="text-[#d14124] bg-[#fae5e1] rounded-full w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">0</span>
              <p className="text-[#737373] mt-1 text-sm">Items in wishlist</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#171717]">Value</h3>
              <span className="text-[#d14124] bg-[#fae5e1] rounded-full w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">$0</span>
              <p className="text-[#737373] mt-1 text-sm">Estimated value</p>
            </div>
          </div>
        </div>

        {/* Collection Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#171717]">Your Collection</h2>
            <Link href="/search" className="text-[#d14124] hover:text-[#b93a20] transition flex items-center gap-1 text-sm font-medium">
              <span>Browse sneakers</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
          
          {/* Empty Collection State */}
          <div className="bg-white border border-dashed border-[#e5e5e5] rounded-xl p-10 text-center">
            <div className="mx-auto w-16 h-16 mb-4 text-[#d14124] opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#171717] mb-2">Your collection is empty</h3>
            <p className="text-[#737373] max-w-md mx-auto mb-6">Start building your sneaker collection by searching for your favorite kicks and adding them.</p>
            <Link href="/search" className="inline-flex items-center justify-center px-6 py-3 bg-[#d14124] text-white rounded-lg hover:bg-[#b93a20] transition shadow-sm">
              Find Sneakers
            </Link>
          </div>
        </section>

        {/* Recent Activity Section (Coming Soon) */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#171717]">Recent Activity</h2>
          </div>
          
          <div className="bg-[#fae5e1] rounded-xl p-8 text-center">
            <div className="mx-auto w-16 h-16 mb-4 text-[#d14124] opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#171717] mb-2">Coming Soon</h3>
            <p className="text-[#737373] max-w-md mx-auto">
              Activity tracking and statistics will be available in a future update. Stay tuned!
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}