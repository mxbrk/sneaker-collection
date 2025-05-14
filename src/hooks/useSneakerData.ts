// src/hooks/useSneakerData.ts - vollständig überarbeitete Version mit Generics
import useSWR from 'swr';

// Cache-Schlüssel für konsistentes Caching
export const CACHE_KEYS = {
  collection: '/api/collection',
  wishlist: '/api/wishlist',
  userData: '/api/user',
  profileData: '/api/profile-data'
};

// Definiere Interfaces für spezifische Datentypen
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

export interface WishlistItem {
  id: string;
  sneakerId: string;
  sku: string;
  brand: string;
  title: string;
  colorway: string;
  image: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string | null;
  showKidsShoes?: boolean;
  genderFilter?: string;
  createdAt?: string;
}

// Definiere Response-Typen für verschiedene Endpunkte
export interface CollectionResponse {
  collection: CollectionItem[];
}

export interface WishlistResponse {
  wishlist: WishlistItem[];
}

export interface UserResponse {
  user: User;
}

export interface ProfileResponse {
  user: User;
  collection: CollectionItem[];
  wishlist: WishlistItem[];
  totalValue: number;
}

// Typ-Map, um Cache-Keys mit ihren Antworttypen zu verbinden
interface CacheKeyToResponseMap {
  [CACHE_KEYS.collection]: CollectionResponse;
  [CACHE_KEYS.wishlist]: WishlistResponse;
  [CACHE_KEYS.userData]: UserResponse;
  [CACHE_KEYS.profileData]: ProfileResponse;
}

// Generischer Fetcher
const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// Generischer Hook für Sneaker-Daten
export function useSneakerData<K extends keyof CacheKeyToResponseMap>(
  cacheKey: K,
  initialData?: CacheKeyToResponseMap[K]
) {
  const { data, error, isLoading, mutate } = useSWR<CacheKeyToResponseMap[K]>(
    cacheKey,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      fallbackData: initialData,
      revalidateIfStale: false,
      revalidateOnReconnect: false
    }
  );

  // Helper-Funktionen mit korrekter Typisierung
  const updateCache = (newData: CacheKeyToResponseMap[K]) => {
    mutate(newData, false);
  };

  const refreshData = () => {
    mutate();
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