import useSWR from 'swr';

// Cache-Schlüssel für konsistentes Caching
export const CACHE_KEYS = {
  collection: '/api/collection',
  wishlist: '/api/wishlist',
  userData: '/api/user',
  profileData: '/api/profile-data'
};

// Definiere generische Typen für die Daten
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
  labels?: string[];
  createdAt: string;
  updatedAt: string;
}

interface WishlistItem {
  id: string;
  sneakerId: string;
  sku: string;
  brand: string;
  title: string;
  colorway: string;
  image: string | null;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  username: string | null;
  showKidsShoes?: boolean;
  genderFilter?: string;
  createdAt?: string;
}

interface CollectionData {
  collection: CollectionItem[];
}

interface WishlistData {
  wishlist: WishlistItem[];
}

interface UserData {
  user: User;
}

interface ProfileData {
  user: User;
  collection: CollectionItem[];
  wishlist: WishlistItem[];
  totalValue: number;
}

// Union-Typ für alle möglichen Datentypen
type SneakerDataType = CollectionData | WishlistData | UserData | ProfileData | null;

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// Haupthook für Sneaker-Daten
export function useSneakerData(cacheKey: string, initialData?: SneakerDataType) {
  const { data, error, isLoading, mutate } = useSWR<SneakerDataType>(cacheKey, fetcher, {
    revalidateOnFocus: false,        // Keine Revalidierung beim Tab-Wechsel
    dedupingInterval: 30000,         // 30 Sekunden Duplizierungsschutz
    fallbackData: initialData,       // Optionale Initial-Daten
    revalidateIfStale: false,        // Keine automatische Revalidierung für alte Daten
    revalidateOnReconnect: false     // Keine Revalidierung bei Wiederverbindung
  });

  // Helper-Funktionen für Cache-Invalidierung
  const updateCache = (newData: SneakerDataType) => {
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