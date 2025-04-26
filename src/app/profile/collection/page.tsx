'use client';

import MainLayout from '@/components/MainLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SneakerCard from '@/components/SneakerCard';
import Notification from '@/components/Notification';
import ConfirmationModal from '@/components/ConfirmationModal';
import { sneakerLabels } from '@/lib/labels';

interface CollectionItem {
  id: string;
  sneakerId: string;
  sku: string;
  brand: string;
  title: string;
  colorway: string;
  image: string | null;
  sizeUS: string;
  sizeEU: string | null;
  sizeUK: string | null;
  condition: string;
  purchaseDate: string | null;
  retailPrice: number | null;
  purchasePrice: number | null;
  notes: string | null;
  labels: string[]; // Add labels field
  createdAt: string;
  updatedAt: string;
}

export default function CollectionPage() {
  const router = useRouter();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string>(''); // Add label filter
  const [sortOption, setSortOption] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
    // State für ein-/ausgeklappte Filter
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/collection');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch collection data');
      }

      const data = await response.json();
      setCollection(data.collection || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCollection = (id: string) => {
    setShowDeleteConfirmation(id);
  };
  
  const confirmRemoveFromCollection = async (id: string) => {
    try {
      const response = await fetch(`/api/collection/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setCollection(collection.filter(item => item.id !== id));
        setNotification({
          message: 'Removed from collection',
          type: 'success'
        });
      } else {
        setNotification({
          message: 'Failed to remove from collection',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error removing from collection:', error);
      setNotification({
        message: 'Failed to remove from collection',
        type: 'error'
      });
    } finally {
      setShowDeleteConfirmation(null);
    }
  };

  // Get unique brands for filter
  const uniqueBrands = Array.from(new Set(collection.map(item => item.brand))).sort();
  
  // Get unique labels used in the collection
  const usedLabels = Array.from(
    new Set(collection.flatMap(item => item.labels || []))
  ).sort();
  
  // Filter and sort collection
  const filteredCollection = collection.filter(item => {
    if (selectedBrand && item.brand !== selectedBrand) return false;
    if (selectedCondition && item.condition !== selectedCondition) return false;
    if (selectedLabel && !(item.labels || []).includes(selectedLabel)) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.colorway.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query))
      );
    }
    return true;
  });
  
  // Sort collection
  const sortedCollection = [...filteredCollection].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'price-high':
        return (b.purchasePrice || 0) - (a.purchasePrice || 0);
      case 'price-low':
        return (a.purchasePrice || 0) - (b.purchasePrice || 0);
      default:
        return 0;
    }
  });

  const getTotalValue = () => {
    return collection.reduce((total, item) => {
      return total + (item.purchasePrice || 0);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d14124] border-r-transparent"></div>
          <p className="mt-2 text-[#737373]">Loading your collection...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
    <div className="min-h-screen bg-[#fafafa]">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
      <Link 
            href="/profile"
            className="text-[#737373] hover:text-[#d14124] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Profile
          </Link>
        <div className="mb-6 flex items-center">
          <h1 className="text-2xl font-bold ml-4">Your Collection</h1>
        </div>

        {/* Collection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#171717]">Total Items</h3>
              <span className="text-[#d14124] bg-[#fae5e1] rounded-full w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">{collection.length}</span>
              <p className="text-[#737373] mt-1 text-sm">Sneakers in collection</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#171717]">Total Value</h3>
              <span className="text-[#d14124] bg-[#fae5e1] rounded-full w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">${getTotalValue().toFixed(2)}</span>
              <p className="text-[#737373] mt-1 text-sm">Total collection value</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#171717]">Average Price</h3>
              <span className="text-[#d14124] bg-[#fae5e1] rounded-full w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold">
                ${collection.length ? (getTotalValue() / collection.length).toFixed(2) : '0.00'}
              </span>
              <p className="text-[#737373] mt-1 text-sm">Per sneaker</p>
            </div>
          </div>
        </div>

        {/* Filters and Search - mit Ein-/Ausklapp-Funktion */}
        <div className="bg-white rounded-lg mb-6 border border-[#f0f0f0]">
          <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setIsFilterExpanded(!isFilterExpanded)}>
            <h3 className="font-medium">Filter & Sort</h3>
            <button 
              className="text-[#737373] hover:text-[#d14124] transition-colors"
              aria-expanded={isFilterExpanded}
              aria-label={isFilterExpanded ? "Collapse filters" : "Expand filters"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transform transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>


        {/* Filters and Sorting */}
        {isFilterExpanded && (
        <div className="p-4 pt-0 border-t border-[#f0f0f0] flex flex-col gap-4">
              <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-[#737373] mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, SKU, or colorway..."
                className="w-full border border-[#e5e5e5] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d14124]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#737373] hover:text-[#d14124]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
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
              <label className="block text-sm font-medium text-[#737373] mb-1">Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full border border-[#e5e5e5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d14124]"
              >
                <option value="">All Conditions</option>
                <option value="DS">Deadstock (DS)</option>
                <option value="VNDS">Very Near Deadstock (VNDS)</option>
                <option value="10">10 - Like new</option>
                <option value="9">9 - Excellent</option>
                <option value="8">8 - Great</option>
                <option value="7">7 - Good</option>
                <option value="6">6 - Acceptable</option>
                <option value="5">5 - Worn</option>
                <option value="4">4 - Very worn</option>
                <option value="3">3 - Heavily worn</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Very poor</option>
              </select>
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
                <option value="price-high">Price (High to Low)</option>
                <option value="price-low">Price (Low to High)</option>
              </select>
            </div>
          </div>
          
          {/* Label Filter Section */}
          {usedLabels.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[#737373] mb-2">Filter by Label</label>
              <div className="flex flex-wrap gap-2">
                {usedLabels.map(labelValue => {
                  const labelInfo = sneakerLabels.find(l => l.value === labelValue);
                  if (!labelInfo) return null;
                  
                  const isSelected = selectedLabel === labelValue;
                  
                  return (
                    <button
                      key={labelValue}
                      onClick={() => setSelectedLabel(isSelected ? '' : labelValue)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1 ${
                        isSelected ? 'bg-opacity-20 border' : 'bg-white border border-[#e5e5e5]'
                      }`}
                      style={{
                        backgroundColor: isSelected ? `${labelInfo.color}20` : undefined,
                        color: isSelected ? labelInfo.color : '#555',
                        borderColor: isSelected ? `${labelInfo.color}50` : undefined,
                      }}
                    >
                      {labelInfo.label}
                      {isSelected && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
        </div>

        {/* Collection Grid */}
        {collection.length > 0 ? (
          <>
            <div className="mb-4 flex justify-between" >
              <p className="text-[#737373]">
                Showing {sortedCollection.length} of {collection.length} sneakers
                {selectedBrand && ` from ${selectedBrand}`}
                {selectedCondition && ` in condition ${selectedCondition}`}
                {selectedLabel && ` with label "${sneakerLabels.find(l => l.value === selectedLabel)?.label || selectedLabel}"`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
              <Link href="/search" className="text-[#d14124] hover:text-[#b93a20] transition flex items-center gap-1 text-sm font-medium">
              <span>Add sneakers</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>

            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedCollection.map((item) => (
                <SneakerCard
                  key={item.id}
                  sneaker={item}
                  isCollectionItem={true}
                  onNotification={(message, type) => {
                    setNotification({ message, type });
                  }}
                  onRemove={() => handleRemoveFromCollection(item.id)}
                  onEdit={() => fetchCollection()} // Reload data after edit
                />
              ))}
            </div>
          </>
        ) : (
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
          title="Remove Sneaker"
          message="Are you sure you want to remove this sneaker from your collection?"
          confirmLabel="Remove"
          onConfirm={() => confirmRemoveFromCollection(showDeleteConfirmation)}
          onCancel={() => setShowDeleteConfirmation(null)}
        />
      )}
    </div>
    </MainLayout>
  );
}