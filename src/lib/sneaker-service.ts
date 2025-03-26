// src/lib/sneaker-service.ts
import { SneakerApiResponse } from '@/types/sneakers';

export const fetchSneakersData = async (query: string): Promise<SneakerApiResponse> => {
  if (!query || query.trim() === '') {
    return { total: 0, page: 1, pages: 0, data: [] };
  }

  const options: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: process.env.NEXT_PUBLIC_SNEAKERS_API_KEY || '', // API key from environment variables
    },
    next: { revalidate: 3600 }, // Cache für 1 Stunde
  };

  try {
    // Optimierte Parameter für schnellere Ladezeiten
    const response = await fetch(
      `https://api.sneakersapi.dev/api/v3/stockx/products?category=sneakers&query=${encodeURIComponent(query)}&limit=12`, 
      options
    );

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    const data: SneakerApiResponse = await response.json();   
    console.log(data); 
    return data;
  } catch (err) {
    console.error('Error:', err);
    // Return empty response in case of error
    return { total: 0, page: 1, pages: 0, data: [] };
  }
};