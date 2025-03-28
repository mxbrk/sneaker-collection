// src/components/CollectionModal.tsx
import { Sneaker } from '@/types/sneakers';
import { FormEvent, useEffect, useState } from 'react';
import { Button, FormError, Input } from './ui';
import { conditionOptions, shoeSizes } from '@/lib/size-conversion';

// Add a CollectionItem type for existing items
export interface CollectionItem {
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

// Type guard function to check if object is a Sneaker
function isSneaker(obj: Sneaker | CollectionItem): obj is Sneaker {
  return 'id' in obj && !('sneakerId' in obj);
}

// Type guard function to check if object is a CollectionItem
function isCollectionItem(obj: Sneaker | CollectionItem): obj is CollectionItem {
  return 'sneakerId' in obj;
}

interface CollectionModalProps {
  sneaker: Sneaker | CollectionItem;
  existingItem?: CollectionItem; // For edit mode
  onClose: () => void;
  onSuccess: () => void;
  mode: 'add' | 'edit';
}

export default function CollectionModal({
  sneaker,
  existingItem,
  onClose,
  onSuccess,
  mode = 'add',
}: CollectionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sizeUS: '',
    condition: '',
    purchaseDate: '',
    purchasePrice: '',
    notes: '',
  });

  // Load existing data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && existingItem) {
      setFormData({
        sizeUS: existingItem.sizeUS || '',
        condition: existingItem.condition || '',
        purchaseDate: existingItem.purchaseDate 
          ? new Date(existingItem.purchaseDate).toISOString().split('T')[0] 
          : '',
        purchasePrice: existingItem.purchasePrice ? existingItem.purchasePrice.toString() : '',
        notes: existingItem.notes || '',
      });
    } else {
      // Initialize form for add mode
      // Use isSneaker type guard to safely access releaseDate and retailPrice
      setFormData({
        sizeUS: '',
        condition: '',
        purchaseDate: isSneaker(sneaker) && sneaker.releaseDate ? sneaker.releaseDate : '',
        purchasePrice: isSneaker(sneaker) && sneaker.retailPrice ? sneaker.retailPrice.toString() : '',
        notes: '',
      });
    }
  }, [mode, existingItem, sneaker]);

  // Find matching EU and UK sizes based on selected US size
  const selectedSize = shoeSizes.find((size) => size.us === formData.sizeUS);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.sizeUS || !formData.condition) {
        throw new Error('Please fill in all required fields');
      }

      // Create the sneaker data using type guards
      let sneakerId: string;
      if (isSneaker(sneaker)) {
        sneakerId = sneaker.id;
      } else if (isCollectionItem(sneaker)) {
        sneakerId = sneaker.sneakerId;
      } else {
        throw new Error('Invalid sneaker data');
      }

      // Create the request payload
      const payload = {
        sneakerId,
        sku: sneaker.sku,
        brand: sneaker.brand,
        title: sneaker.title,
        colorway: sneaker.colorway || '',
        image: sneaker.image || '',
        sizeUS: formData.sizeUS,
        sizeEU: selectedSize?.eu,
        sizeUK: selectedSize?.uk,
        condition: formData.condition,
        purchaseDate: formData.purchaseDate || undefined,
        retailPrice: isSneaker(sneaker) ? sneaker.retailPrice : null,
        purchasePrice: formData.purchasePrice
          ? parseFloat(formData.purchasePrice)
          : undefined,
        notes: formData.notes || undefined,
      };

      // Log the payload for debugging
      console.log(`${mode === 'add' ? 'Adding' : 'Updating'} sneaker:`, payload);

      let url = '/api/collection';
      let method = 'POST';

      // For edit mode, use PUT with the item ID
      if (mode === 'edit' && existingItem) {
        url = `/api/collection/${existingItem.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${mode === 'add' ? 'add to' : 'update'} collection`);
      }

      // Success
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      {/* Rest of the component remains unchanged */}
      <div
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b border-[#f0f0f0] flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#171717]">
            {mode === 'add' ? 'Add to Collection' : 'Edit Sneaker'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#737373] hover:text-[#171717] transition-colors p-1 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Form content continues... */}
        <div className="p-6">
          {/* Rest of the component code remains unchanged */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="relative w-full md:w-1/3 aspect-square bg-[#ffffff] rounded-lg overflow-hidden">
              {sneaker.image ? (
                <img
                  src={sneaker.image}
                  alt={sneaker.title}
                  className="object-contain w-full h-full p-2"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[#d0d0d0]">
                  No Image
                </div>
              )}
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="text-lg font-medium text-[#171717] mb-1">
                {sneaker.title}
              </h3>
              <p className="text-[#737373] text-sm mb-1">{sneaker.colorway || 'N/A'}</p>
              <p className="text-[#737373] text-sm font-mono mb-3">{sneaker.sku}</p>
              {isSneaker(sneaker) && sneaker.retailPrice && (
                <p className="font-medium text-[#d14124]">
                  Retail: ${sneaker.retailPrice}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormError message={error || undefined} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Size Selection */}
              <div>
                <label htmlFor="sizeUS" className="block text-sm font-medium mb-1">
                  Size (US) <span className="text-red-500">*</span>
                </label>
                <select
                  id="sizeUS"
                  name="sizeUS"
                  value={formData.sizeUS}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d14124] focus:border-[#d14124] bg-white"
                  required
                >
                  <option value="">Select Size</option>
                  {shoeSizes.map((size) => (
                    <option key={size.us} value={size.us}>
                      US {size.us}
                    </option>
                  ))}
                </select>
                {selectedSize && (
                  <p className="mt-1 text-xs text-[#737373]">
                    EU {selectedSize.eu} / UK {selectedSize.uk}
                  </p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium mb-1">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d14124] focus:border-[#d14124] bg-white"
                  required
                >
                  <option value="">Select Condition</option>
                  {conditionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purchase Date */}
              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-medium mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d14124] focus:border-[#d14124] bg-white"
                />
                {isSneaker(sneaker) && sneaker.releaseDate && (
                  <p className="mt-1 text-xs text-[#737373]">
                    Release date: {new Date(sneaker.releaseDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Purchase Price */}
              <div>
                <label htmlFor="purchasePrice" className="block text-sm font-medium mb-1">
                  Purchase Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="purchasePrice"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d14124] focus:border-[#d14124] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d14124] focus:border-[#d14124] bg-white"
                placeholder="Add any personal notes about this sneaker..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#e5e5e5] rounded-lg text-[#171717] hover:bg-[#f5f5f5] transition-colors"
              >
                Cancel
              </button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? (mode === 'add' ? 'Adding...' : 'Saving...') 
                  : (mode === 'add' ? 'Add to Collection' : 'Save Changes')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}