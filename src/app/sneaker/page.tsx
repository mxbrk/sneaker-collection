"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

// Define interface for Sneaker
interface Sneaker {
  id: string;
  title: string;
  brand: string;
  model: string;
  description: string;
  image: string;
  sku: string;
  slug: string;
  category: string;
  product_type: string;
  secondary_category: string;
}

interface SneakerApiResponse {
  data: Sneaker[];
  meta: {
    total: number;
    limit: number;
  };
}

// Popular brands for quick filtering
const popularBrands = [
  "Nike", "Adidas", "Jordan", "New Balance", "Reebok", 
  "Puma", "Converse", "Vans", "ASICS", "Yeezy"
];

// Shoe sizes for selection
const shoeSizes = [
  "US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5", "US 10", 
  "US 10.5", "US 11", "US 11.5", "US 12", "US 12.5", "US 13"
];

const fetchSneakersData = async (query: string) => {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: process.env.NEXT_PUBLIC_SNEAKERS_API_KEY || '', // API key from environment variables
    },
  };

  try {
    const response = await fetch(`https://api.sneakersapi.dev/api/v3/stockx/products?query=${query}`, options);

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    const data: SneakerApiResponse = await response.json();
    return data;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};

// Function to add sneaker to wishlist
const addToWishlist = async (sneaker: Sneaker, size: string) => {
  try {
    const response = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sneakerId: sneaker.id,
        sneakerName: sneaker.title,
        brand: sneaker.brand,
        imageUrl: sneaker.image,
        size: size,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add to wishlist');
    }
    
    return data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Function to add sneaker to collection
const addToCollection = async (sneaker: Sneaker, size: string, condition: string) => {
  try {
    // Convert US size to EU and UK sizes (simplified conversion)
    const usSize = parseFloat(size.replace('US ', ''));
    const euSize = (usSize + 33).toFixed(1);
    const ukSize = (usSize - 0.5).toFixed(1);

    const response = await fetch('/api/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sneakerId: sneaker.id,
        sneakerName: sneaker.title,
        brand: sneaker.brand,
        model: sneaker.model || sneaker.title.split(' ').slice(1).join(' '),
        imageUrl: sneaker.image,
        sizeUS: usSize,
        sizeEU: euSize,
        sizeUK: ukSize,
        condition: condition,
        notes: '',
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add to collection');
    }
    
    return data;
  } catch (error) {
    console.error('Error adding to collection:', error);
    throw error;
  }
};

const SneakerSearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [sneakerData, setSneakerData] = useState<SneakerApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<Record<string, boolean>>({});
  const [isAddingToCollection, setIsAddingToCollection] = useState<Record<string, boolean>>({});
  const [selectedConditions, setSelectedConditions] = useState<Record<string, string>>({});
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial search if query parameter exists
  useEffect(() => {
    if (initialQuery) {
      handleSearch(null, initialQuery);
    }
  }, [initialQuery]);

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent | null, searchQuery: string = query) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Update URL with search query
      const params = new URLSearchParams(searchParams.toString());
      params.set('query', searchQuery);
      router.push(`/sneaker?${params.toString()}`);

      const data = await fetchSneakersData(searchQuery);
      setSneakerData(data);
      
      // Initialize selected sizes and conditions for each sneaker
      const initialSizes: Record<string, string> = {};
      const initialConditions: Record<string, string> = {};
      
      data.data.forEach(sneaker => {
        initialSizes[sneaker.id] = shoeSizes[0];
        initialConditions[sneaker.id] = "DS (Deadstock)";
      });
      
      setSelectedSizes(initialSizes);
      setSelectedConditions(initialConditions);
    } catch (err) {
      setError('Error fetching sneaker data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick search by brand
  const handleBrandSearch = (brand: string) => {
    setQuery(brand);
    handleSearch(null, brand);
  };
  
  // Handle size selection
  const handleSizeChange = (sneakerId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [sneakerId]: size
    }));
  };

  // Handle condition selection
  const handleConditionChange = (sneakerId: string, condition: string) => {
    setSelectedConditions(prev => ({
      ...prev,
      [sneakerId]: condition
    }));
  };
  
  // Handle adding to wishlist
  const handleAddToWishlist = async (sneaker: Sneaker) => {
    try {
      setIsAddingToWishlist(prev => ({
        ...prev,
        [sneaker.id]: true
      }));
      
      const size = selectedSizes[sneaker.id] || shoeSizes[0];
      await addToWishlist(sneaker, size);
      
      toast.success(`Added ${sneaker.title} (Size ${size}) to your wishlist!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to wishlist');
    } finally {
      setIsAddingToWishlist(prev => ({
        ...prev,
        [sneaker.id]: false
      }));
    }
  };

  // Handle adding to collection
  const handleAddToCollection = async (sneaker: Sneaker) => {
    try {
      setIsAddingToCollection(prev => ({
        ...prev,
        [sneaker.id]: true
      }));
      
      const size = selectedSizes[sneaker.id] || shoeSizes[0];
      const condition = selectedConditions[sneaker.id] || "DS (Deadstock)";
      
      await addToCollection(sneaker, size, condition);
      
      toast.success(`Added ${sneaker.title} (Size ${size}) to your collection!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to collection');
    } finally {
      setIsAddingToCollection(prev => ({
        ...prev,
        [sneaker.id]: false
      }));
    }
  };

  // Open details modal
  const openDetailsModal = (sneaker: Sneaker) => {
    setSelectedSneaker(sneaker);
    setIsModalOpen(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedSneaker(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero search section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl mb-8 p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-6">Find Your Perfect Sneakers</h1>
          
          <form onSubmit={(e) => handleSearch(e)} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by model, SKU, or keywords..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition shadow-sm disabled:opacity-70"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Popular brands quick search */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="text-blue-100 text-sm mr-2 my-auto">Popular Brands:</span>
            {popularBrands.slice(0, 6).map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandSearch(brand)}
                className="py-1 px-3 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full transition"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Search results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Searching for sneakers...</p>
          </div>
        ) : sneakerData ? (
          <>
            {/* Search results stats */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {sneakerData.data.length > 0 
                  ? `Found ${sneakerData.meta.total} results for "${query}"`
                  : `No results found for "${query}"`}
              </h2>
            </div>

            {/* Sneaker grid */}
            {sneakerData.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sneakerData.data.map((sneaker) => (
                  <div key={sneaker.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition group">
                    {/* Sneaker image */}
                    <div 
                      className="h-56 bg-gray-50 flex items-center justify-center p-4 cursor-pointer"
                      onClick={() => openDetailsModal(sneaker)}
                    >
                      {sneaker.image ? (
                        <div className="relative h-full w-full">
                          <img
                            src={sneaker.image}
                            alt={sneaker.title}
                            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="text-gray-400">No image available</div>
                      )}
                    </div>
                    
                    {/* Sneaker info */}
                    <div className="p-4">
                      <div className="mb-3">
                        <p className="text-sm font-medium text-blue-600">{sneaker.brand}</p>
                        <h3 
                          className="text-lg font-bold line-clamp-2 cursor-pointer hover:text-blue-700"
                          onClick={() => openDetailsModal(sneaker)}
                        >
                          {sneaker.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">SKU: {sneaker.sku}</p>
                      </div>
                      
                      {/* Size selection */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size:</label>
                        <select 
                          value={selectedSizes[sneaker.id] || shoeSizes[0]} 
                          onChange={(e) => handleSizeChange(sneaker.id, e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                        >
                          {shoeSizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddToWishlist(sneaker)}
                          disabled={isAddingToWishlist[sneaker.id]}
                          className="flex items-center justify-center py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition disabled:opacity-70"
                        >
                          {isAddingToWishlist[sneaker.id] ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Adding...
                            </span>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              Wishlist
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleAddToCollection(sneaker)}
                          disabled={isAddingToCollection[sneaker.id]}
                          className="flex items-center justify-center py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-70"
                        >
                          {isAddingToCollection[sneaker.id] ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Adding...
                            </span>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Collection
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center shadow-md">
                <div className="flex justify-center mb-6">
                  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.429 15a3.001 3.001 0 00-2.83 2H9.83c-.25-.78-.732-1.43-1.365-1.886m10.964-.114A8.962 8.962 0 0112 4c-4.962 0-9 4.038-9 9 0 1.73.489 3.35 1.336 4.728"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 19.5L4.5 4.5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No sneakers found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or browse popular brands</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleBrandSearch(brand)}
                      className="py-1.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full transition"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <div className="flex justify-center mb-6">
              <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Find your favorite sneakers</h3>
            <p className="text-gray-600 mb-6">Search by brand, model, or SKU to find sneakers</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandSearch(brand)}
                  className="py-1.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full transition"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sneaker Details Modal */}
      {isModalOpen && selectedSneaker && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Sneaker Details</h3>
              <button onClick={closeDetailsModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Sneaker image */}
                <div className="w-full md:w-1/2">
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center h-64 md:h-80">
                    {selectedSneaker.image ? (
                      <img
                        src={selectedSneaker.image}
                        alt={selectedSneaker.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">No image available</div>
                    )}
                  </div>
                </div>
                
                {/* Sneaker info */}
                <div className="w-full md:w-1/2">
                  <p className="text-blue-600 font-medium">{selectedSneaker.brand}</p>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedSneaker.title}</h2>
                  
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm">
                        <p className="text-gray-500">SKU</p>
                        <p className="font-medium">{selectedSneaker.sku}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-500">Category</p>
                        <p className="font-medium">{selectedSneaker.category || "N/A"}</p>
                      </div>
                    </div>
                    
                    {/* Size selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Size:</label>
                      <select 
                        value={selectedSizes[selectedSneaker.id] || shoeSizes[0]} 
                        onChange={(e) => handleSizeChange(selectedSneaker.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        {shoeSizes.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Condition selection for collection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condition:</label>
                      <select 
                        value={selectedConditions[selectedSneaker.id] || "DS (Deadstock)"} 
                        onChange={(e) => handleConditionChange(selectedSneaker.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="DS (Deadstock)">DS (Deadstock)</option>
                        <option value="VNDS (Very Near Deadstock)">VNDS (Very Near Deadstock)</option>
                        <option value="9/10">9/10 - Excellent</option>
                        <option value="8/10">8/10 - Great</option>
                        <option value="7/10">7/10 - Good</option>
                        <option value="6/10">6/10 - Fair</option>
                        <option value="5/10">5/10 - Average</option>
                        <option value="4/10">4/10 - Below Average</option>
                        <option value="3/10">3/10 - Poor</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal footer with action buttons */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleAddToWishlist(selectedSneaker);
                    closeDetailsModal();
                  }}
                  disabled={isAddingToWishlist[selectedSneaker.id]}
                  className="flex-1 flex items-center justify-center py-2.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition disabled:opacity-70"
                >
                  {isAddingToWishlist[selectedSneaker.id] ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Add to Wishlist
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    handleAddToCollection(selectedSneaker);
                    closeDetailsModal();
                  }}
                  disabled={isAddingToCollection[selectedSneaker.id]}
                  className="flex-1 flex items-center justify-center py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-70"
                  >
                    {isAddingToCollection[selectedSneaker.id] ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Add to Collection
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Toast notifications container */}
        <ToastContainer position="bottom-right" />
      </div>
    );
  };
  
  export default SneakerSearchPage;