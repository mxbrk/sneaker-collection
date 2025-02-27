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

const SneakerSearchPage = () => {
  const [query, setQuery] = useState(''); // Der Suchbegriff (z.B. SKU oder Modellname)
  const [sneakerData, setSneakerData] = useState<SneakerApiResponse | null>(null); // Die Daten der Sneaker
  const [error, setError] = useState<string>(''); // Fehlerstatus

  // Funktion, die beim Absenden des Formulars ausgeführt wird
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Fehler zurücksetzen

    try {
      const data = await fetchSneakersData(query); // API-Abfrage
      setSneakerData(data); // Sneaker-Daten speichern
    } catch (err) {
      setError('Fehler beim Abrufen der Sneaker-Daten');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Suche nach einem Sneaker</h1>

        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            placeholder="SKU oder Modellname"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Suchen
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}

        {sneakerData && sneakerData.data.length > 0 && (
          <div className="mt-6">
            {sneakerData.data.map((sneaker) => (
              <div key={sneaker.id} className="mb-4">
                <h3 className="text-xl font-semibold">{sneaker.title}</h3>
                <img
                  src={sneaker.image}
                  alt={sneaker.title}
                  className="mx-auto mt-4"
                  width="200"
                />
                <div className="mt-4">
                  <p><strong>Marke:</strong> {sneaker.brand}</p>
                  <p><strong>Modell:</strong> {sneaker.model}</p>
                  <p><strong>SKU:</strong> {sneaker.sku}</p>
                  <p><strong>Kategorie:</strong> {sneaker.category}</p>
                  <p><strong>Produktart:</strong> {sneaker.product_type}</p>
                  <p><strong>Sekundäre Kategorie:</strong> {sneaker.secondary_category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SneakerSearchPage;
