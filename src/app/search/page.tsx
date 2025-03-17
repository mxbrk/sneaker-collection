'use client';

import { Button } from '@/components/ui';
import { fetchSneakersData } from '@/lib/sneaker-service';
import { Sneaker } from '@/types/sneakers';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SneakerCard from '@/components/SneakerCard';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchSneakersData(searchQuery);
      setSneakers(result.data);
      setTotalResults(result.total);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to fetch sneakers. Please try again.');
      setSneakers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
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
                className="bg-[#fae5e1] text-[#d14124] px-3 py-2 rounded-md text-sm font-medium"
              >
                Search
              </Link>
              <Link
                href="/profile"
                className="text-[#171717] px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#171717] mb-2">
            Find Your Perfect Sneakers
          </h1>
          <p className="text-[#737373]">
            Search for sneakers by brand, model, colorway, or SKU
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex w-full max-w-3xl">
            <input
              type="text"
              placeholder="Search for sneakers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-3 border border-[#e5e5e5] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#d14124] focus:border-[#d14124]"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-l-none"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div>
            {/* Results Header */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-[#171717]">
                {isLoading ? 'Searching...' : (
                  sneakers.length > 0 
                    ? `Found ${totalResults} results for "${searchQuery}"`
                    : `No results found for "${searchQuery}"`
                )}
              </h2>
            </div>

            {/* Results Grid */}
            {sneakers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sneakers.map((sneaker) => (
                  <SneakerCard key={sneaker.id} sneaker={sneaker} />
                ))}
              </div>
            ) : hasSearched && !isLoading ? (
              <div className="bg-[#f1f1f1] rounded-lg p-8 text-center">
                <p className="text-lg font-medium mb-2">No sneakers found</p>
                <p className="text-[#737373]">
                  Try searching with different keywords or check back later for new arrivals.
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && !isLoading && (
          <div className="bg-[#fae5e1] rounded-lg p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-xl font-medium text-[#d14124] mb-2">
              Discover Your Next Pair
            </h2>
            <p className="text-[#171717] mb-4">
              Search for your favorite brands like Nike, Adidas, Jordan, Yeezy, and more.
            </p>
            <div className="text-sm text-[#737373]">
              Try searching for: "Jordan 1", "Yeezy 350", "Nike Dunk", "Adidas Ultra Boost"
            </div>
          </div>
        )}
      </main>
    </div>
  );
}