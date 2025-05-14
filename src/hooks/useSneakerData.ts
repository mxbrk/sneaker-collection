import useSWR from 'swr';

// Cache-Schlüssel für konsistentes Caching
export const CACHE_KEYS = {
  collection: '/api/collection',
  wishlist: '/api/wishlist',
  userData: '/api/user',
  profileData: '/api/profile-data'
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// Haupthook für Sneaker-Daten
export function useSneakerData(cacheKey: string, initialData?: any) {
  const { data, error, isLoading, mutate } = useSWR(cacheKey, fetcher, {
    revalidateOnFocus: false,        // Keine Revalidierung beim Tab-Wechsel
    dedupingInterval: 30000,         // 30 Sekunden Duplizierungsschutz
    fallbackData: initialData,       // Optionale Initial-Daten
    revalidateIfStale: false,        // Keine automatische Revalidierung für alte Daten
    revalidateOnReconnect: false     // Keine Revalidierung bei Wiederverbindung
  });

  // Helper-Funktionen für Cache-Invalidierung
  const updateCache = (newData: any) => {
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