// src/components/SneakerCard.tsx
import { Sneaker } from '@/types/sneakers';
import Image from 'next/image';
import { useState } from 'react';
import CollectionModal from './CollectionModal';

// Add the CollectionItem interface definition
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
  createdAt: string;
  updatedAt: string;
}

// Update the props to accept either Sneaker or CollectionItem
interface SneakerCardProps {
  sneaker: Sneaker | CollectionItem;
  onNotification?: (message: string, type: 'success' | 'error') => void;
  isCollectionItem?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
}

export default function SneakerCard({ 
  sneaker, 
  onNotification,
  isCollectionItem = false,
  onRemove,
  onEdit
}: SneakerCardProps) {
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddToWishlist = async () => {
    if (addedToWishlist || isAddingToWishlist) return;
    
    setIsAddingToWishlist(true);
    try {
      // Make sure we have all required properties and check if it's a Sneaker
      // by using 'id' property which only exists on Sneaker but not on CollectionItem
      if (!('id' in sneaker) || !sneaker.id || !sneaker.sku || !sneaker.brand || !sneaker.title) {
        throw new Error('Missing required sneaker information');
      }
      
      // Create payload with fallbacks for optional fields
      const payload = {
        sneakerId: sneaker.id,
        sku: sneaker.sku,
        brand: sneaker.brand,
        title: sneaker.title,
        colorway: sneaker.colorway || '',
        image: sneaker.image || '',
      };
      
      console.log('Sending wishlist payload:', payload);
      
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Wishlist response:', data);
      
      if (response.ok) {
        setAddedToWishlist(true);
        if (onNotification) {
          onNotification('Added to wishlist!', 'success');
        } else {
          showSuccess('Added to wishlist!');
        }
      } else {
        if (response.status === 409) {
          setAddedToWishlist(true);
          if (onNotification) {
            onNotification(data.error || 'Already in wishlist', 'error');
          }
        } else {
          if (onNotification) {
            onNotification(data.error || 'Failed to add to wishlist', 'error');
          }
        }
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (onNotification) {
        onNotification('Failed to add to wishlist', 'error');
      }
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleCollectionSuccess = () => {
    setShowCollectionModal(false);
    if (onNotification) {
      onNotification(isCollectionItem ? 'Updated successfully!' : 'Added to collection!', 'success');
    } else {
      showSuccess(isCollectionItem ? 'Updated successfully!' : 'Added to collection!');
    }
    
    // Call the onEdit callback if in edit mode
    if (isCollectionItem && onEdit) {
      onEdit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[#f0f0f0] relative">
      {/* Success message toast (only used if no onNotification prop) */}
      {successMessage && !onNotification && (
        <div className="absolute top-2 right-2 z-10 bg-green-100 text-green-800 text-sm py-1 px-3 rounded-full">
          {successMessage}
        </div>
      )}
      
      <div className="relative h-48 bg-[#ffffff] overflow-hidden p-2">
        {sneaker.image ? (
          <Image
            src={sneaker.image}
            alt={`${sneaker.title} - ${sneaker.sku || 'Sneaker'}`}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain hover:scale-105 transition-transform duration-300"
            style={{ objectPosition: 'center' }}
            quality={85}
            loading="eager"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmN2Y3Ii8+PC9zdmc+"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d0d0d0]">
            No Image Available
          </div>
        )}
        
        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {!isCollectionItem && (
            <button
              onClick={handleAddToWishlist}
              disabled={addedToWishlist || isAddingToWishlist}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                addedToWishlist 
                  ? 'bg-[#fae5e1] text-[#d14124]' 
                  : 'bg-white text-[#737373] hover:text-[#d14124] shadow-sm hover:bg-[#fae5e1]'
              }`}
              title={addedToWishlist ? "Added to wishlist" : "Add to wishlist"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={addedToWishlist ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          )}
          
          <button
            onClick={() => setShowCollectionModal(true)}
            className="w-8 h-8 rounded-full bg-white text-[#737373] hover:text-[#d14124] shadow-sm hover:bg-[#fae5e1] flex items-center justify-center transition-colors"
            title={isCollectionItem ? "Edit sneaker" : "Add to collection"}
          >
            {isCollectionItem ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            )}
          </button>
          
          {/* Remove button for collection items */}
          {isCollectionItem && onRemove && (
            <button
              onClick={onRemove}
              className="w-8 h-8 rounded-full bg-white text-[#737373] hover:text-red-500 shadow-sm hover:bg-red-50 flex items-center justify-center transition-colors"
              title="Remove from collection"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-[#171717] line-clamp-2 mb-1">
          {sneaker.title || "Unnamed Sneaker"}
        </h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-mono text-[#737373]">
            {sneaker.sku}
          </span>
          {'retailPrice' in sneaker && sneaker.retailPrice ? (
            <span className="text-[#d14124] font-medium">
              ${sneaker.retailPrice}
            </span>
          ) : 'purchasePrice' in sneaker && sneaker.purchasePrice ? (
            <span className="text-[#d14124] font-medium">
              ${sneaker.purchasePrice}
            </span>
          ) : null}
        </div>
        
        {/* Show size and condition for collection items */}
        {'sizeUS' in sneaker && 'condition' in sneaker && (
          <div className="mt-2 flex items-center text-xs text-[#737373]">
            <span className="px-2 py-1 bg-[#f5f5f5] rounded-full mr-2">
              US {sneaker.sizeUS}
            </span>
            <span>{sneaker.condition}</span>
          </div>
        )}
      </div>
      
      {/* Collection Modal */}
      {showCollectionModal && (
        <CollectionModal
          sneaker={sneaker}
          existingItem={'sizeUS' in sneaker ? sneaker : undefined}
          onClose={() => setShowCollectionModal(false)}
          onSuccess={handleCollectionSuccess}
          mode={isCollectionItem ? 'edit' : 'add'}
        />
      )}
    </div>
  );
}