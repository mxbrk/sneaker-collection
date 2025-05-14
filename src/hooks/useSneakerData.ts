// src/hooks/useSneakerData.ts
import useSWR from 'swr';

// Cache-Schlüssel für konsistentes Caching
export const CACHE_KEYS = {
  collection: '/api/collection',
  wishlist: '/api/wishlist',
  userData: '/api/user',
  profileData: '/api/profile-data'
};

// Einfache Typdefinitionen für die häufigsten Datenstrukturen
export interface CollectionItem {
  id: string;
  // andere Collection-Item Eigenschaften
}

export interface WishlistItem {
  id: string;
  // andere Wishlist-Item Eigenschaften
}

export interface UserData {
  id: string;
  // andere User-Eigenschaften
}

// Generische Funktion für den API-Aufruf
const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// Generischer Hook für Sneaker-Daten
export function useSneakerData<T>(cacheKey: string, initialData?: T) {
  const { data, error, isLoading, mutate } = useSWR<T>(cacheKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
    fallbackData: initialData,
    revalidateIfStale: false,
    revalidateOnReconnect: false
  });

  // Helper-Funktionen für Cache-Invalidierung
  const updateCache = (newData: T) => {
    mutate(newData, false); // Update Cache ohne Revalidierung
  };

  const refreshData = () => {
    mutate(); // Erzwungene Revalidierung
  };

  return {
    data,
    error,
    isLoading,
    mutate,
    updateCache,
    refreshData
  };
}