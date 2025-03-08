"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface WishlistItem {
  id: string;
  sneakerName: string;
  brand: string;
  imageUrl: string | null;
  size: string;
}

interface CollectionItem {
  id: string;
  sneakerName: string;
  brand: string;
  imageUrl: string | null;
  sizeUS: number;
  condition: string;
}

export default function Profile() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user profile
        const userRes = await fetch("/api/me");
        if (!userRes.ok) {
          router.push("/login");
          return;
        }
        const userData = await userRes.json();
        setUser(userData);

        // Fetch wishlist preview
        const wishlistRes = await fetch("/api/wishlist");
        if (wishlistRes.ok) {
          const data = await wishlistRes.json();
          // Only get first 4 items for preview
          setWishlistItems(data.items.slice(0, 4));
        }

        // Fetch collection preview
        const collectionRes = await fetch("/api/collection");
        if (collectionRes.ok) {
          const data = await collectionRes.json();
          // Only get first 4 items for preview
          setCollectionItems(data.collection.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">Welcome, {user?.username || "User"}</h1>
              <p className="text-gray-600 mt-1">Manage your sneaker collection and wishlist</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Collection Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">My Collection</h2>
              <Link href="/collection">
                <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </span>
              </Link>
            </div>
            
            <div className="p-6">
              {collectionItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't added any sneakers to your collection yet.</p>
                  <Link href="/sneaker">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                      Find Sneakers
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {collectionItems.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden flex">
                      <div className="w-1/3 bg-white-100 flex items-center justify-center p-2">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.sneakerName}
                            className="h-20 object-contain"
                          />
                        ) : (
                          <div className="h-20 w-full flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="w-2/3 p-3">
                        <h3 className="font-medium text-sm line-clamp-1">{item.sneakerName}</h3>
                        <p className="text-gray-600 text-xs">{item.brand}</p>
                        <div className="mt-2 flex justify-between text-xs">
                          <span>US {item.sizeUS}</span>
                          <span className="text-gray-500">{item.condition}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {collectionItems.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href="/collection">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                      Manage Collection
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Wishlist and Settings */}
          <div className="flex flex-col gap-6">
            {/* Wishlist Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-purple-50 border-b border-purple-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Wishlist</h2>
                <Link href="/profile/wishlist">
                  <span className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                    View All
                  </span>
                </Link>
              </div>
              
              <div className="p-4">
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm mb-3">Your wishlist is empty</p>
                    <Link href="/sneaker">
                      <button className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition">
                        Add Sneakers
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 border-b border-gray-100 pb-3">
                        <div className="w-12 h-12 bg-white-100 rounded flex items-center justify-center shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.sneakerName}
                              className="h-10 object-contain"
                            />
                          ) : (
                            <div className="text-xs text-gray-400">No img</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-1">{item.sneakerName}</h3>
                          <p className="text-xs text-gray-600">{item.brand} • {item.size}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-2">
                      <Link href="/profile/wishlist">
                        <button className="w-full px-3 py-1.5 border border-purple-600 text-purple-600 rounded-md text-sm hover:bg-purple-50 transition">
                          Manage Wishlist
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Settings Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Quick Settings</h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  <Link href="/profile/settings">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Account Settings</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                  
                  <Link href="/profile/settings?tab=security">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Security</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}