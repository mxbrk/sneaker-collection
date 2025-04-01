'use client';

import { useState, useEffect } from 'react';
import { fetchSneakersData } from '@/lib/sneaker-service';
import MainLayout from '@/components/MainLayout';
import { Sneaker } from '@/types/sneakers';
import SneakerCard from '@/components/SneakerCard';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Notification from '@/components/Notification';
import { useAuth } from '@/contexts/auth-context';

export default function SearchPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  // Client-side protection - if not logged in and not loading, redirect to login
  useEffect(() => {
    if (!loading && !user) {
      console.log('Not authenticated. Redirecting from search page.');
      router.push('/login');
    }
  }, [user, loading, router]);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  
  // Add state for user
  const [userData, setUserData] = useState<{
    id: string;
    email: string;
    username: string | null;
    showKidsShoes: boolean;
    genderFilter: string;
  } | null>(null);
  
  // Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Function to clear search when directly navigating to /search
  useEffect(() => {
    // Check if we're on the search page with no query params
    if (pathname === '/search' && !searchParams.has('q')) {
      // Clear search state
      setSearchQuery('');
      setSneakers([]);
      setTotalResults(0);
    }
  }, [pathname, searchParams]);

  // Add function to fetch user with proper error handling
  const fetchUser = async () => {
    try {
      console.log("Fetching user data..."); // Debug logging
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        console.log("User data:", data.user); // Debug logging including showKidsShoes
        setUserData(data.user);
        return data.user;
      } else {
        console.log("Error fetching user data:", response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  // Update the effect to ensure user is loaded before search
  useEffect(() => {
    // Fetch user first
    const initialLoad = async () => {
      const userData = await fetchUser();
      
      // Only run search if there's an initial query
      if (initialQuery) {
        handleSearch(userData);
      }
    };
    
    initialLoad();
  }, [initialQuery]);

  // Loading state or not logged in - show appropriate UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d14124] border-r-transparent"></div>
          <p className="mt-2 text-[#737373]">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d14124] border-r-transparent"></div>
          <p className="mt-2 text-[#737373]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Rest of your search page component code...
  // (Keep the existing code for handleSearch, etc.)

  // Update handleSearch to accept user data parameter
  const handleSearch = async (userData = user) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Use the user preference for showing kids shoes
      // Fall back to provided userData if state isn't updated yet
      const showKidsShoes = userData?.showKidsShoes ?? user?.showKidsShoes ?? true;
      const genderFilter = userData?.genderFilter ?? user?.genderFilter ?? 'both';
      console.log("Searching with showKidsShoes:", showKidsShoes, "genderFilter:", genderFilter); // Update log

      const result = await fetchSneakersData(searchQuery, showKidsShoes, genderFilter);      
      // Add null checks here
      if (result && result.data) {
        console.log("Got search results:", result.data.length); // Debug logging
        setSneakers(result.data);
        setTotalResults(result.total || 0);
      } else {
        // Handle case where result or result.data is null
        setSneakers([]);
        setTotalResults(0);
        setError('No results found or invalid response format, check for typos or misspelling.');
      }
      
      // Update URL with search query
      const params = new URLSearchParams(window.location.search);
      params.set('q', searchQuery);
      router.push(`/search?${params.toString()}`, { scroll: false });
    } catch (err) {
      setError('Failed to fetch sneakers. Please try again.' + (err));
      setSneakers([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };


  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Minimalist search section with large, prominent search bar */}
        <section className="pt-10 pb-6 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-[#171717] mb-6 text-center">
              Find Your Sneakers
            </h1>
            
            {/* Large search input with integrated button */}
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 pl-6 pr-16 rounded-xl border-2 border-[#e5e5e5] focus:border-[#d14124] focus:ring-[#d14124] shadow-sm focus:shadow-md transition-all bg-white text-[#171717] placeholder-[#9ca3af] outline-none text-lg"
                placeholder="Search by brand, model, or color..."
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={() => handleSearch()}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center bg-[#d14124] text-white rounded-lg hover:bg-[#b93a20] transition-colors disabled:opacity-70"
                aria-label="Search"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Results section */}
        <section className="pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Results header - only shown when there are results or searching */}
            {((sneakers && sneakers.length > 0) || isLoading) && (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#171717]">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="h-5 w-5 mr-2 border-t-2 border-r-2 border-[#d14124] rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  ) : (
                    `Found ${totalResults} results for "${searchQuery}"`
                  )}
                </h2>
                
                {/* Add this part to show the filter status */}
                {!isLoading && (
                  <div className="text-sm text-[#737373] flex flex-wrap gap-2">
                    {userData?.showKidsShoes === false && (
                      <span className="inline-flex items-center px-2 py-1 bg-[#fae5e1] text-[#d14124] rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                        {"Excluding kids' sizes"}
                      </span>
                    )}
                    {userData?.genderFilter !== 'both' && (
                      <span className="inline-flex items-center px-2 py-1 bg-[#fae5e1] text-[#d14124] rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                        {userData?.genderFilter === 'men' ? "Men's shoes only" : "Women's shoes only"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8">
                {error}
              </div>
            )}
            
            {/* Sneaker grid with skeleton loading state */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] animate-pulse">
                    <div className="aspect-square bg-[#f5f5f5]"></div>
                    <div className="p-4">
                      <div className="h-5 bg-[#f5f5f5] rounded-md mb-2"></div>
                      <div className="h-4 bg-[#f5f5f5] rounded-md w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sneakers.map((sneaker) => (
                  <SneakerCard 
                    key={sneaker.id} 
                    sneaker={sneaker} 
                    onNotification={showNotification}
                  />
                ))}
              </div>
            )}
            
            {/* Empty state - shown when search returns no results */}
            {!isLoading && sneakers && sneakers.length === 0 && searchQuery && (
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] p-8 text-center">
                <div className="h-20 w-20 mx-auto mb-4 text-[#d14124] opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-[#171717] mb-2">No sneakers found</h3>
                <p className="text-[#737373] max-w-md mx-auto">
                {"We couldn't find any sneakers matching your search. Try using different keywords or check back later."}
                </p>
              </div>
            )}
            
            {/* Initial empty state with search suggestions */}
            {!isLoading && (!sneakers || sneakers.length === 0) && !searchQuery && (
              <div className="mt-8 bg-gradient-to-br from-[#fae5e1] to-white rounded-xl p-8 text-center shadow-sm">
                <h3 className="text-xl font-medium text-[#171717] mb-4">Start Your Search</h3>
                <p className="text-[#737373] max-w-md mx-auto mb-6">
                  Enter keywords like brand names, models, or colors to find your sneakers.
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                  {["Nike Air Max", "Jordan 1", "Adidas Yeezy", "New Balance", "Ultra Boost", "Nike Dunk", "Converse"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setTimeout(() => handleSearch(), 0);
                      }}
                      className="px-3 py-1.5 text-sm bg-white border border-[#e5e5e5] rounded-full hover:border-[#d14124] hover:text-[#d14124] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Floating "back to top" button - only shown when scrolled down */}
        {sneakers.length > 0 && (
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 rounded-full w-12 h-12 bg-[#d14124] text-white shadow-lg flex items-center justify-center hover:bg-[#b93a20] transition-colors"
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </button>
        )}
        
        {/* Notification */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onDismiss={() => setNotification(null)}
          />
        )}
      </div>
    </MainLayout>
  );
}