'use client';

import MainLayout from '@/components/MainLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Notification from '@/components/Notification';
import ConfirmationModal from '@/components/ConfirmationModal';

interface WishlistItem {
  id: string;
  sneakerId: string;
  sku: string;
  brand: string;
  title: string;
  colorway: string;
  image: string | null;
  createdAt: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('newest');
  
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/wishlist');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch wishlist data');
      }

      const data = await response.json();
      setWishlist(data.wishlist || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = (id: string) => {
    setShowDeleteConfirmation(id);
  };
  
  const confirmRemoveFromWishlist = async (id: string) => {
    try {
      const response = await fetch(`/api/wishlist?id=${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setWishlist(wishlist.filter(item => item.id !== id));
        setNotification({
          message: 'Removed from wishlist',
          type: 'success'
        });
      } else {
        setNotification({
          message: 'Failed to remove from wishlist',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setNotification({
        message: 'Failed to remove from wishlist',
        type: 'error'
      });
    } finally {
      setShowDeleteConfirmation(null);
    }
  };

  // Get unique brands for filter
  const uniqueBrands = Array.from(new Set(wishlist.map(item => item.brand))).sort();
  
  // Filter and sort wishlist
  const filteredWishlist = wishlist.filter(item => {
    if (selectedBrand && item.brand !== selectedBrand) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.colorway.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  // Sort wishlist
  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d14124] border-r-transparent"></div>
          <p className="mt-2 text-[#737373]">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
    <div className="min-h-screen bg-[#fafafa]">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link 
            href="/profile"
            className="text-[#737373] hover:text-[#d14124] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Profile
          </Link>
          <h1 className="text-2xl font-bold ml-4">Your Wishlist</h1>
        </div>

        {/* Wishlist Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#171717]">Total Items</h3>
              <span className="text-[#d14124] bg-[#fae5e1] rounded-full w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">{wishlist.length}</span>
              <p className="text-[#737373] mt-1 text-sm">Items in wishlist</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#171717]">Brands</h3>
              <span className="text-[#d14124] bg-[#fae5e1] rounded-full w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">{uniqueBrands.length}</span>
              <p className="text-[#737373] mt-1 text-sm">Different brands</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#171717]">Added</h3>
              <span className="text-[#d14124] bg-[#fae5e1] rounded-full w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              {wishlist.length > 0 ? (
                <span className="text-3xl font-bold">
                  {new Date(
                    Math.max(...wishlist.map(item => new Date(item.createdAt).getTime()))
                  ).toLocaleDateString()}
                </span>
              ) : (
                <span className="text-3xl font-bold">-</span>
              )}
              <p className="text-[#737373] mt-1 text-sm">Last item added</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-[#f0f0f0] flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#737373] mb-1">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full border border-[#e5e5e5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d14124]"
            >
              <option value="">All Brands</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#737373] mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU, or colorway"
              className="w-full border border-[#e5e5e5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d14124]"
            />
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[#737373] mb-1">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full border border-[#e5e5e5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d14124]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Wishlist Grid */}
        {wishlist.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-[#737373]">
                Showing {sortedWishlist.length} of {wishlist.length} items
                {selectedBrand && ` from ${selectedBrand}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedWishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] hover:shadow-md transition-shadow relative group">
                  <div className="absolute top-2 right-2 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="w-8 h-8 rounded-full bg-white text-[#737373] hover:text-red-500 flex items-center justify-center shadow-sm"
                      title="Remove from wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="relative h-40 bg-[#ffffff] overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#d0d0d0]">
                        No Image Available
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-[#171717] truncate">{item.title}</h3>
                    <p className="text-xs text-[#737373] mt-1 truncate">{item.colorway}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-mono text-[#737373]">{item.sku}</span>
                      <button
                        onClick={() => {
                          router.push(`/search?q=${encodeURIComponent(item.title)}`);
                        }}
                        className="px-3 py-1 bg-[#fae5e1] text-[#d14124] text-xs rounded-full hover:bg-[#d14124] hover:text-white transition-colors"
                      >
                        Find to Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white border border-dashed border-[#e5e5e5] rounded-xl p-10 text-center">
            <div className="mx-auto w-16 h-16 mb-4 text-[#d14124] opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#171717] mb-2">Your wishlist is empty</h3>
            <p className="text-[#737373] max-w-md mx-auto mb-6">Add sneakers to your wishlist while browsing to keep track of what you want to buy next.</p>
            <Link href="/search" className="inline-flex items-center justify-center px-6 py-3 bg-[#d14124] text-white rounded-lg hover:bg-[#b93a20] transition shadow-sm">
              Find Sneakers
            </Link>
          </div>
        )}
      </main>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onDismiss={() => setNotification(null)}
        />
      )}

      {/* Confirmation Modal */}
      {showDeleteConfirmation && (
        <ConfirmationModal
          title="Remove Item"
          message="Are you sure you want to remove this sneaker from your wishlist?"
          confirmLabel="Remove"
          onConfirm={() => confirmRemoveFromWishlist(showDeleteConfirmation)}
          onCancel={() => setShowDeleteConfirmation(null)}
        />
      )}
    </div>
    </MainLayout>
  );
}