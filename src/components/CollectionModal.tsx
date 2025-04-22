// src/components/CollectionModal.tsx
import { Sneaker } from '@/types/sneakers';
import { FormEvent, useEffect, useState } from 'react';
import { Button, FormError} from './ui';
import { conditionOptions, shoeSizes } from '@/lib/size-conversion';
import { sneakerLabels } from '@/lib/labels';
import Image from 'next/image';

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
  labels?: string[];
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
    labels: [] as string[], // Add labels to form state
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
        labels: existingItem.labels || [], // Load existing labels
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
        labels: [], // Initialize empty labels array for new items
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

  // Add label toggle function
  const toggleLabel = (labelValue: string) => {
    setFormData(prev => {
      const currentLabels = [...prev.labels];
      const index = currentLabels.indexOf(labelValue);
      
      if (index >= 0) {
        // Remove label if it exists
        currentLabels.splice(index, 1);
      } else {
        // Add label if it doesn't exist
        currentLabels.push(labelValue);
      }
      
      return {
        ...prev,
        labels: currentLabels
      };
    });
  };


// In src/components/CollectionModal.tsx, etwa Zeile 170-230
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    // Pflichtfelder validieren
    if (!formData.sizeUS || !formData.condition) {
      throw new Error('Bitte fülle alle Pflichtfelder aus');
    }

    // Sneaker-ID ermitteln
    let sneakerId: string;
    if (isSneaker(sneaker)) {
      sneakerId = sneaker.id;
    } else if (isCollectionItem(sneaker)) {
      sneakerId = sneaker.sneakerId;
    } else {
      throw new Error('Ungültige Sneaker-Daten');
    }

    // Grundlegendes Payload mit Pflichtfeldern erstellen
    const payload: any = {
      sneakerId,
      sku: sneaker.sku,
      brand: sneaker.brand,
      title: sneaker.title,
      colorway: sneaker.colorway || '',
      image: sneaker.image || null,
      sizeUS: formData.sizeUS,
      sizeEU: selectedSize?.eu || null,
      sizeUK: selectedSize?.uk || null,
      condition: formData.condition,
      labels: formData.labels || [],
      // Wichtig: Sicherstellen, dass optionale Felder korrekt behandelt werden
      notes: formData.notes?.trim() || null,
      purchaseDate: formData.purchaseDate?.trim() ? formData.purchaseDate : null,
      purchasePrice: formData.purchasePrice?.trim() ? parseFloat(formData.purchasePrice) : null,
      retailPrice: isSneaker(sneaker) && sneaker.retailPrice ? Number(sneaker.retailPrice) : null
    };

    console.log(`${mode === 'add' ? 'Adding' : 'Updating'} sneaker:`, payload);

    let url = '/api/collection';
    let method = 'POST';

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
    
    if (!response.ok) {
      console.log('Server response:', data);
      
      if (data.details) {
        console.error('Validation details:', data.details);
        throw new Error(data.error || 'Validation error');
      }
      
      throw new Error(data.error || `Error ${mode === 'add' ? 'adding to' : 'updating'} collection`);
    }

    // Success
    onSuccess();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Something went wrong');
    console.error('Error:', err);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      {/* Backdrop for closing */}
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

        {/* Form content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="relative w-full md:w-1/3 aspect-square bg-[#ffffff] rounded-lg overflow-hidden">
  {sneaker.image ? (
    <Image
      src={sneaker.image}
      alt={sneaker.title}
      fill={true}
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-contain p-2"
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

            {/* Labels selection */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Labels
              </label>
              <div className="flex flex-wrap gap-2">
                {sneakerLabels.map((labelOption) => {
                  const isSelected = formData.labels.includes(labelOption.value);
                  return (
                    <button
                      key={labelOption.value}
                      type="button"
                      onClick={() => toggleLabel(labelOption.value)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        isSelected 
                          ? 'bg-opacity-20 border' 
                          : 'bg-white border border-[#e5e5e5]'
                      }`}
                      style={{
                        backgroundColor: isSelected ? `${labelOption.color}20` : undefined,
                        color: isSelected ? labelOption.color : '#555',
                        borderColor: isSelected ? `${labelOption.color}50` : undefined,
                      }}
                    >
                      <span className="flex items-center gap-1">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: labelOption.color }}
                        />
                        {labelOption.label}
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
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