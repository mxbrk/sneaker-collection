"use client";
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Definiere den Typ für die API-Antwort
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

const fetchSneakersData = async (query: string) => {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: 'sd_RbI4wpZAJaxOlLbwtgkno686hwd5xHey', // Dein API-Schlüssel
    },
  };

  try {
    const response = await fetch(`https://api.sneakersapi.dev/api/v3/stockx/products?query=${query}`, options);

    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Daten');
    }

    // Definiere die Antwort als SneakerApiResponse
    const data: SneakerApiResponse = await response.json();
    
    return data; // Rückgabe der Sneaker-Daten
  } catch (err) {
    console.error('Fehler:', err);
    throw err; // Fehler wird erneut geworfen
  }
};

// Shoe sizes for selection
const shoeSizes = [
  "US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5", "US 10", 
  "US 10.5", "US 11", "US 11.5", "US 12", "US 12.5", "US 13"
];

// Function to add sneaker to wishlist
const addToWishlist = async (sneaker: Sneaker, size: string) => {
  try {
    const response = await fetch('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

const SneakerSearchPage = () => {
  const [query, setQuery] = useState(''); // Der Suchbegriff (z.B. SKU oder Modellname)
  const [sneakerData, setSneakerData] = useState<SneakerApiResponse | null>(null); // Die Daten der Sneaker
  const [error, setError] = useState<string>(''); // Fehlerstatus
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<Record<string, boolean>>({});

  // Funktion, die beim Absenden des Formulars ausgeführt wird
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Fehler zurücksetzen

    try {
      const data = await fetchSneakersData(query); // API-Abfrage
      setSneakerData(data); // Sneaker-Daten speichern
      
      // Initialize selected sizes for each sneaker
      const initialSizes: Record<string, string> = {};
      data.data.forEach(sneaker => {
        initialSizes[sneaker.id] = shoeSizes[0];
      });
      setSelectedSizes(initialSizes);
      
    } catch (err) {
      setError('Fehler beim Abrufen der Sneaker-Daten');
    }
  };
  
  // Handle size selection
  const handleSizeChange = (sneakerId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [sneakerId]: size
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center p-8 bg-white shadow-md rounded-lg w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-4">Suche nach einem Sneaker</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="SKU oder Modellname"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            >
              Suchen
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {sneakerData && sneakerData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sneakerData.data.map((sneaker) => (
              <div key={sneaker.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="p-4 bg-gray-50 flex justify-center">
                  <img
                    src={sneaker.image}
                    alt={sneaker.title}
                    className="h-48 object-contain"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{sneaker.title}</h3>
                  <p className="text-gray-600 mb-2">{sneaker.brand}</p>
                  <div className="text-sm mb-4">
                    <p><span className="font-medium">SKU:</span> {sneaker.sku}</p>
                    <p><span className="font-medium">Category:</span> {sneaker.category}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Size:
                    </label>
                    <select 
                      value={selectedSizes[sneaker.id] || shoeSizes[0]} 
                      onChange={(e) => handleSizeChange(sneaker.id, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {shoeSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={() => handleAddToWishlist(sneaker)}
                    disabled={isAddingToWishlist[sneaker.id]}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
                  >
                    {isAddingToWishlist[sneaker.id] ? 'Adding...' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : sneakerData ? (
          <p className="text-gray-600">No sneakers found for "{query}"</p>
        ) : null}
      </div>
      
      {/* Toast notifications container */}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default SneakerSearchPage;