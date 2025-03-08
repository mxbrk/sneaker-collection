"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SneakerCollectionItem {
  id: string;
  sneakerId: string;
  sneakerName: string;
  brand: string;
  model: string;
  imageUrl: string | null;
  sizeUS: number;
  sizeEU: number;
  sizeUK: number;
  condition: string;
  notes: string | null;
  purchaseDate: string | null;
  releaseDate: string | null;
  createdAt: string;
}

export default function CollectionPage() {
    const [collection, setCollection] = useState<SneakerCollectionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();
  
    useEffect(() => {
      const fetchCollection = async () => {
        try {
          const response = await fetch('/api/collection', {
            method: 'GET',
            credentials: 'include',
          });
  
          if (!response.ok) {
            if (response.status === 401) {
              router.push('/login');
              return;
            }
            throw new Error('Failed to fetch collection');
          }
  
          const data = await response.json();
          setCollection(data.collection);
        } catch (err) {
          setError('Error loading your collection. Please try again later.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCollection();
    }, [router]);
  
    // Function to format date strings
    const formatDate = (dateString: string | null) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    };
    
    // Function to delete a sneaker from collection
    const handleDelete = async (id: string) => {
      if (!confirm('Bist du sicher, dass du diesen Sneaker aus deiner Sammlung entfernen möchtest?')) {
        return;
      }
      
      try {
        const response = await fetch(`/api/collection/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Fehler beim Löschen');
        }
        
        // Remove the deleted item from the collection state
        setCollection(collection.filter(item => item.id !== id));
        setSuccessMessage('Sneaker erfolgreich aus der Sammlung entfernt');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        setError('Fehler beim Entfernen des Sneakers aus der Sammlung');
        console.error(err);
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Meine Sneaker-Sammlung</h1>
            <Link href="/sneaker">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Sneaker hinzufügen
              </button>
            </Link>
          </div>
  
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}
  
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Lade deine Sammlung...</p>
            </div>
          ) : collection.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Deine Sammlung ist noch leer</h2>
              <p className="text-gray-600 mb-6">
                Füge deinen ersten Sneaker hinzu, um mit dem Aufbau deiner Sammlung zu beginnen.
              </p>
              <Link href="/sneaker">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Jetzt Sneaker hinzufügen
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collection.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-white-200 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.sneakerName}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">Kein Bild verfügbar</div>
                    )}
                  </div>
  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 truncate">{item.sneakerName}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.brand} {item.model}</p>
  
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center border rounded-md p-1">
                        <span className="text-xs text-gray-500 block">US</span>
                        <span className="font-medium">{item.sizeUS}</span>
                      </div>
                      <div className="text-center border rounded-md p-1">
                        <span className="text-xs text-gray-500 block">EU</span>
                        <span className="font-medium">{item.sizeEU}</span>
                      </div>
                      <div className="text-center border rounded-md p-1">
                        <span className="text-xs text-gray-500 block">UK</span>
                        <span className="font-medium">{item.sizeUK}</span>
                      </div>
                    </div>
  
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Zustand:</span>
                        <span className="ml-1 font-medium">{item.condition}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Kaufdatum:</span>
                        <span className="ml-1">{formatDate(item.purchaseDate)}</span>
                      </div>
                    </div>
  
                    {item.notes && (
                      <div className="mb-3">
                        <span className="text-gray-500 text-sm">Notizen:</span>
                        <p className="text-sm mt-1 text-gray-700">{item.notes}</p>
                      </div>
                    )}
  
                    <div className="flex justify-between mt-2">
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Entfernen
                      </button>
                      <Link href={`/collection/${item.id}`}>
                        <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                          Details anzeigen
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }