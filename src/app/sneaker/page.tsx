"use client";
import { useState } from 'react';

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
  release_date?: string;
}

interface SneakerApiResponse {
  data: Sneaker[];
  meta: {
    total: number;
    limit: number;
  };
}

interface AddToCollectionForm {
  sizeUS: string;
  sizeEU: string;
  sizeUK: string;
  condition: string;
  notes: string;
  purchaseDate: string;
  useReleaseDate: boolean;
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

const SneakerSearchPage = () => {
  const [query, setQuery] = useState(''); // Der Suchbegriff (z.B. SKU oder Modellname)
  const [sneakerData, setSneakerData] = useState<SneakerApiResponse | null>(null); // Die Daten der Sneaker
  const [error, setError] = useState<string>(''); // Fehlerstatus
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState<AddToCollectionForm>({
    sizeUS: '',
    sizeEU: '',
    sizeUK: '',
    condition: 'DS',
    notes: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    useReleaseDate: false,
  });

  // Predefined size mappings
  const sizeMappings = [
    { us: 6, eu: 38, uk: 5 },
    { us: 6.5, eu: 39, uk: 5.5 },
    { us: 7, eu: 40, uk: 6 },
    { us: 7.5, eu: 40.5, uk: 6.5 },
    { us: 8, eu: 41, uk: 7 },
    { us: 8.5, eu: 42, uk: 7.5 },
    { us: 9, eu: 42.5, uk: 8 },
    { us: 9.5, eu: 43, uk: 8.5 },
    { us: 10, eu: 44, uk: 9 },
    { us: 10.5, eu: 44.5, uk: 9.5 },
    { us: 11, eu: 45, uk: 10 },
    { us: 11.5, eu: 45.5, uk: 10.5 },
    { us: 12, eu: 46, uk: 11 },
    { us: 12.5, eu: 47, uk: 11.5 },
    { us: 13, eu: 47.5, uk: 12 },
  ];

  // Condition options
  const conditionOptions = [
    { value: 'DS', label: 'DS (Dead Stock)' },
    { value: 'VNDS', label: 'VNDS (Very Near Dead Stock)' },
    { value: '9/10', label: '9/10' },
    { value: '8/10', label: '8/10' },
    { value: '7/10', label: '7/10' },
    { value: '6/10', label: '6/10' },
    { value: '5/10', label: '5/10' },
    { value: '4/10', label: '4/10' },
    { value: '3/10', label: '3/10' },
    { value: '2/10', label: '2/10' },
    { value: '1/10', label: '1/10' },
  ];

  // Function to update form values based on selected US size
  const updateSizesByUS = (usSize: string) => {
    const usFloat = parseFloat(usSize);
    const mapping = sizeMappings.find(m => m.us === usFloat);
    
    if (mapping) {
      setFormData({
        ...formData,
        sizeUS: usSize,
        sizeEU: mapping.eu.toString(),
        sizeUK: mapping.uk.toString(),
      });
    } else {
      setFormData({
        ...formData,
        sizeUS: usSize,
      });
    }
  };

  // Function to update form values based on selected EU size
  const updateSizesByEU = (euSize: string) => {
    const euFloat = parseFloat(euSize);
    const mapping = sizeMappings.find(m => m.eu === euFloat);
    
    if (mapping) {
      setFormData({
        ...formData,
        sizeEU: euSize,
        sizeUS: mapping.us.toString(),
        sizeUK: mapping.uk.toString(),
      });
    } else {
      setFormData({
        ...formData,
        sizeEU: euSize,
      });
    }
  };

  // Function to update form values based on selected UK size
  const updateSizesByUK = (ukSize: string) => {
    const ukFloat = parseFloat(ukSize);
    const mapping = sizeMappings.find(m => m.uk === ukFloat);
    
    if (mapping) {
      setFormData({
        ...formData,
        sizeUK: ukSize,
        sizeUS: mapping.us.toString(),
        sizeEU: mapping.eu.toString(),
      });
    } else {
      setFormData({
        ...formData,
        sizeUK: ukSize,
      });
    }
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'sizeUS') {
      updateSizesByUS(value);
    } else if (name === 'sizeEU') {
      updateSizesByEU(value);
    } else if (name === 'sizeUK') {
      updateSizesByUK(value);
    } else if (name === 'useReleaseDate') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        useReleaseDate: isChecked,
        purchaseDate: isChecked && selectedSneaker?.release_date 
          ? new Date(selectedSneaker.release_date).toISOString().split('T')[0]
          : formData.purchaseDate,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Funktion, die beim Absenden des Formulars ausgeführt wird
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Fehler zurücksetzen
    setSuccessMessage('');
    setSelectedSneaker(null);
    setShowAddForm(false);

    try {
      const data = await fetchSneakersData(query); // API-Abfrage
      setSneakerData(data); // Sneaker-Daten speichern
    } catch (err) {
      setError('Fehler beim Abrufen der Sneaker-Daten');
    }
  };

  // Function to open the add to collection form
  const handleAddToCollection = (sneaker: Sneaker) => {
    setSelectedSneaker(sneaker);
    setShowAddForm(true);
    setFormData({
      sizeUS: '9',
      sizeEU: '42.5',
      sizeUK: '8',
      condition: 'DS',
      notes: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      useReleaseDate: false,
    });
    
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('add-to-collection-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Function to submit the add to collection form
  const handleSubmitToCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedSneaker) {
      setError('Kein Sneaker ausgewählt');
      return;
    }

    try {
      const response = await fetch('/api/collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sneakerId: selectedSneaker.id,
          sneakerName: selectedSneaker.title,
          brand: selectedSneaker.brand,
          model: selectedSneaker.model,
          imageUrl: selectedSneaker.image,
          sizeUS: formData.sizeUS,
          sizeEU: formData.sizeEU,
          sizeUK: formData.sizeUK,
          condition: formData.condition,
          notes: formData.notes,
          purchaseDate: formData.purchaseDate,
          releaseDate: selectedSneaker.release_date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Hinzufügen zur Sammlung');
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setShowAddForm(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ein unbekannter Fehler ist aufgetreten');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Suche nach einem Sneaker</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="SKU oder Modellname"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 sm:w-auto w-full"
              >
                Suchen
              </button>
            </div>
          </form>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>}

        {/* Add to Collection Form */}
        {showAddForm && selectedSneaker && (
          <div id="add-to-collection-form" className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Zur Sammlung hinzufügen</h2>
            <div className="flex items-center mb-4">
              <img 
                src={selectedSneaker.image} 
                alt={selectedSneaker.title} 
                className="w-20 h-20 object-cover mr-4" 
              />
              <div>
                <h3 className="font-medium">{selectedSneaker.title}</h3>
                <p className="text-sm text-gray-600">{selectedSneaker.brand}</p>
              </div>
            </div>

            <form onSubmit={handleSubmitToCollection}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">US Größe</label>
                  <select 
                    name="sizeUS" 
                    value={formData.sizeUS} 
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {sizeMappings.map(size => (
                      <option key={`us-${size.us}`} value={size.us}>{size.us}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">EU Größe</label>
                  <select 
                    name="sizeEU" 
                    value={formData.sizeEU} 
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {sizeMappings.map(size => (
                      <option key={`eu-${size.eu}`} value={size.eu}>{size.eu}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UK Größe</label>
                  <select 
                    name="sizeUK" 
                    value={formData.sizeUK} 
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {sizeMappings.map(size => (
                      <option key={`uk-${size.uk}`} value={size.uk}>{size.uk}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Zustand</label>
                <select 
                  name="condition" 
                  value={formData.condition} 
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  {conditionOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notiz</label>
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                ></textarea>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input 
                    type="checkbox" 
                    id="useReleaseDate" 
                    name="useReleaseDate" 
                    checked={formData.useReleaseDate} 
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label htmlFor="useReleaseDate" className="text-sm font-medium text-gray-700">
                    Release-Datum verwenden ({selectedSneaker.release_date 
                    ? new Date(selectedSneaker.release_date).toLocaleDateString() 
                    : 'Nicht verfügbar'})
                  </label>
                </div>
                
                {!formData.useReleaseDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kaufdatum</label>
                    <input 
                      type="date" 
                      name="purchaseDate" 
                      value={formData.purchaseDate} 
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Abbrechen
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Zur Sammlung hinzufügen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Results */}
        {sneakerData && sneakerData.data.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Suchergebnisse ({sneakerData.meta.total})</h2>
            
            {sneakerData.data.map((sneaker) => (
              <div key={sneaker.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-4 md:mb-0 flex items-center justify-center">
                    <img
                      src={sneaker.image}
                      alt={sneaker.title}
                      className="max-w-full max-h-48 object-contain"
                    />
                  </div>
                  <div className="md:w-2/3 md:pl-6">
                    <h3 className="text-xl font-semibold mb-2">{sneaker.title}</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Marke:</p>
                        <p>{sneaker.brand}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Modell:</p>
                        <p>{sneaker.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">SKU:</p>
                        <p>{sneaker.sku}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Kategorie:</p>
                        <p>{sneaker.category}</p>
                      </div>
                      {sneaker.release_date && (
                        <div>
                          <p className="text-sm text-gray-600">Release-Datum:</p>
                          <p>{new Date(sneaker.release_date).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCollection(sneaker)}
                      className="mt-2 w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Zur Sammlung hinzufügen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sneakerData ? (
          <div className="text-center p-8 bg-white shadow-md rounded-lg">
            <p>Keine Sneaker für "{query}" gefunden.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SneakerSearchPage;