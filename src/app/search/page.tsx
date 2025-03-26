'use client';

import { useState, useEffect } from 'react';
import { fetchSneakersData } from '@/lib/sneaker-service';
import { Sneaker } from '@/types/sneakers';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchSneakersData(searchQuery);
      setSneakers(result.data);
      setTotalResults(result.total);
      
      // Update URL with search query
      const params = new URLSearchParams(window.location.search);
      params.set('q', searchQuery);
      router.push(`/search?${params.toString()}`, { scroll: false });
    } catch (err) {
      setError('Failed to fetch sneakers. Please try again.');
      setSneakers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern, minimalist navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#d14124] to-[#e87a64]">
              Sneaker Collection
            </Link>
            <nav className="flex space-x-1">
              <Link href="/" className="text-[#171717] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#f5f5f5] transition-colors">
                Home
              </Link>
              <Link href="/search" className="bg-[#fae5e1] text-[#d14124] px-3 py-2 rounded-lg text-sm font-medium">
                Search
              </Link>
              <Link href="/profile" className="text-[#171717] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#f5f5f5] transition-colors">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Minimalist search section with large, prominent search bar */}
      <section className="pt-10 pb-6 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-[#171717] mb-6 text-center">
            Find Your Perfect Sneakers
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
              onClick={handleSearch}
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
          {(sneakers.length > 0 || isLoading) && (
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
                <div key={sneaker.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#f0f0f0]">
                  <div className="relative aspect-square bg-[#ffffff] overflow-hidden">
                    {sneaker.image ? (
                      <Image
                        src={sneaker.image}
                        alt={sneaker.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#d0d0d0]">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-[#171717] line-clamp-1 group-hover:text-[#d14124] transition-colors">
                      {sneaker.title || "Unnamed Sneaker"}
                    </h3>
                    <div className="mt-1 flex justify-between items-center">
                      <span className="text-xs font-mono text-[#737373]">{sneaker.sku}</span>
                      {sneaker.retailPrice ? (
                        <span className="text-[#d14124] font-semibold">${sneaker.retailPrice}</span>
                      ) : null}
                    </div>
                    <div className="mt-2 text-xs text-[#737373] flex items-center gap-2">
                      <span className="px-2 py-1 bg-[#f5f5f5] rounded-full">{sneaker.brand}</span>
                      <span className="line-clamp-1">{sneaker.colorway}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Empty state - shown when search returns no results */}
          {!isLoading && sneakers.length === 0 && searchQuery && (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] p-8 text-center">
              <div className="h-20 w-20 mx-auto mb-4 text-[#d14124] opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#171717] mb-2">No sneakers found</h3>
              <p className="text-[#737373] max-w-md mx-auto">
                We couldn't find any sneakers matching your search. Try using different keywords or check back later.
              </p>
            </div>
          )}
          
          {/* Initial empty state with search suggestions */}
          {!isLoading && sneakers.length === 0 && !searchQuery && (
            <div className="mt-8 bg-gradient-to-br from-[#fae5e1] to-white rounded-xl p-8 text-center shadow-sm">
              <h3 className="text-xl font-medium text-[#171717] mb-4">Start Your Search</h3>
              <p className="text-[#737373] max-w-md mx-auto mb-6">
                Enter keywords like brand names, models, or colors to find your perfect sneakers.
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
    </div>
  );
}