"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

interface WishlistItem {
  id: string;
  sneakerId: string;
  sneakerName: string;
  brand: string;
  imageUrl: string | null;
  size: string;
  createdAt: string;
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/wishlist", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch wishlist");
      }

      const data = await response.json();
      setWishlistItems(data.items);
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching your wishlist");
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      setIsRemoving(prev => ({ ...prev, [itemId]: true }));
      
      const response = await fetch(`/api/wishlist?id=${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove from wishlist");
      }

      // Update state to remove the item
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      toast.success("Item removed from wishlist");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove from wishlist");
      console.error("Error removing from wishlist:", error);
    } finally {
      setIsRemoving(prev => ({ ...prev, [itemId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Add some sneakers to your wishlist to keep track of the ones you want.</p>
            <Link href="/sneaker">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition">
                Browse Sneakers
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 flex justify-center">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.sneakerName} 
                      className="h-48 object-contain"
                    />
                  ) : (
                    <div className="h-48 w-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.sneakerName}</h3>
                  <p className="text-gray-600 mb-2">{item.brand}</p>
                  <p className="text-sm font-medium mb-4">Size: {item.size}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={isRemoving[item.id]}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition"
                    >
                      {isRemoving[item.id] ? 'Removing...' : 'Remove'}
                    </button>
                    
                    <Link href={`/sneaker?query=${encodeURIComponent(item.sneakerName)}`} className="flex-1">
                      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Toast notifications container */}
      <ToastContainer position="bottom-right" />
    </div>
  );
}