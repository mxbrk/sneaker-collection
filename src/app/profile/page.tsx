'use client';

import MainLayout from '@/components/MainLayout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SneakerCard from '@/components/SneakerCard';
import Notification from '@/components/Notification';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useSneakerData, CACHE_KEYS } from '@/hooks/useSneakerData';
import { SkeletonGrid } from '@/components/SkeletonLoader';

interface User {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
}

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
  labels?: string[];
  createdAt: string;
  updatedAt: string;
}

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

// Definiere die Struktur der API-Antwort
interface ProfileResponse {
  user: User;
  collection: CollectionItem[];
  wishlist: WishlistItem[];
  totalValue: number;
}

export default function ProfilePage() {
  const router = useRouter();
  
  // SWR für alle Profildaten verwenden mit explizitem Typ
  const { 
    data: profileData, 
    isLoading, 
    error: fetchError, 
    refreshData, 
    updateCache 
  } = useSneakerData<ProfileResponse>(CACHE_KEYS.profileData);
  
  // Daten aus der Antwort extrahieren
  const user = profileData?.user;
  const collection = profileData?.collection || [];
  const wishlist = profileData?.wishlist || [];
  const totalValue = profileData?.totalValue || 0;

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fehler aus SWR übernehmen
    if (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Something went wrong');
    }
  }, [fetchError]);

  // Diese Funktion aufrufen, wenn Daten aktualisiert werden müssen
  const fetchData = () => {
    refreshData();
  };

  const handleRemoveFromWishlist = async (id: string) => {
    try {
      const response = await fetch(`/api/wishlist?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Lokalen Cache aktualisieren
        const updatedWishlist = wishlist.filter(item => item.id !== id);
        updateCache({
          ...profileData,
          wishlist: updatedWishlist
        });
        
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
        // Lokalen Cache aktualisieren
        const updatedCollection = collection.filter(item => item.id !== id);
        const newTotalValue = updatedCollection.reduce(
          (total, item) => total + (item.purchasePrice || 0), 
          0
        );
        
        updateCache({
          ...profileData,
          collection: updatedCollection,
          totalValue: newTotalValue
        });
        
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

  if (isLoading && !user) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#fafafa] py-6">
          <div className="max-w-7xl mx-auto px-4">
            {/* Skeleton für Hero-Sektion */}
            <div className="relative bg-gradient-to-r from-[#fae5e1] to-[#fcf5f3] rounded-2xl overflow-hidden mb-10 animate-pulse">
              <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
                <div className="w-36 h-36 md:w-40 md:h-40 rounded-full bg-[#f5f5f5]"></div>
                <div className="flex-1">
                  <div className="h-8 bg-[#f5f5f5] rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-[#f5f5f5] rounded w-1/3"></div>
                </div>
              </div>
            </div>
            
            {/* Skeleton für Stats-Karten */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0] animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-[#f5f5f5] rounded w-1/3"></div>
                    <div className="w-10 h-10 rounded-full bg-[#f5f5f5]"></div>
                  </div>
                  <div className="mt-4">
                    <div className="h-8 bg-[#f5f5f5] rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-[#f5f5f5] rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Skeletons für Collection und Wishlist */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-[#f5f5f5] rounded w-1/4"></div>
                <div className="h-4 bg-[#f5f5f5] rounded w-16"></div>
              </div>
              <SkeletonGrid count={4} />
            </div>
            
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-[#f5f5f5] rounded w-1/4"></div>
                <div className="h-4 bg-[#f5f5f5] rounded w-16"></div>
              </div>
              <SkeletonGrid count={4} />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-[#fafafa] py-6">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4">
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
                <div className="absolute bottom-4 right-4 z-10">
                  <Link href="/profile/settings" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e5e5] rounded-lg text-[#171717] hover:bg-[#f8f8f8] transition shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Link 
              href="/profile/collection"
              className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0] hover:shadow-md transition-shadow hover:border-[#d14124] cursor-pointer"
            >
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
                <span className="text-3xl font-bold">{collection.length}</span>
                <p className="text-[#737373] mt-1 text-sm">Total sneakers</p>
              </div>
            </Link>
            
            <Link 
              href="/profile/wishlist"
              className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0] hover:shadow-md transition-shadow hover:border-[#d14124] cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-[#171717]">Wishlist</h3>
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
            </Link>
            
            <Link 
              href=""
              className="bg-white p-6 rounded-xl shadow-sm border border-[#f0f0f0] hover:shadow-md transition-shadow hover:border-[#d14124] cursor-pointer"
            >              
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
                <span className="text-3xl font-bold">${totalValue.toFixed(2)}</span>
                <p className="text-[#737373] mt-1 text-sm">Estimated value</p>
              </div>
            </Link>
          </div>

          {/* Collection Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#171717]">Your Collection</h2>
              <Link href="/profile/collection" className="text-[#d14124] hover:text-[#b93a20] transition flex items-center gap-1 text-sm font-medium">
                <span>View all</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
            
            {collection.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collection.slice(0, 4).map((item) => (
                  <SneakerCard
                    key={item.id}
                    sneaker={item}
                    isCollectionItem={true}
                    onNotification={(message, type) => {
                      setNotification({ message, type });
                    }}
                    onRemove={() => handleRemoveFromCollection(item.id)}
                    onEdit={() => fetchData()} // Reload data after edit
                  />
                ))}
              </div>
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
          </section>

          {/* Wishlist Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#171717]">Your Wishlist</h2>
              <Link href="/profile/wishlist" className="text-[#d14124] hover:text-[#b93a20] transition flex items-center gap-1 text-sm font-medium">
                <span>View all</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
            
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.slice(0, 4).map((item) => (
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
                    <div className="relative h-52 bg-[#ffffff] overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain scale-125 p-2"
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
          </section>
        </div>

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