// src/types/sneakers.ts
export interface Sneaker {
  id: string;
  title: string;
  sku: string;
  image: string;
  brand: string;
  colorway: string;
  retailPrice?: number;
  releaseDate?: string;
  model?: string;         // Added for GOAT API
  description?: string;   // Added for GOAT API
}

export interface SneakerApiResponse {
  total: number;
  page: number;
  pages: number;
  data: Sneaker[];
}

// Original GOAT API response type (for reference)
export interface GoatApiResponse {
  status: string;
  query: { query: string };
  data: GoatSneaker[];
  meta: { current_page: number; per_page: number; total: number };
}

export interface GoatSneaker {
  id: number;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  colorway: string;
  season: string;
  category: string;
  product_type: string;
  image_url: string;
  release_date: string;
  release_date_year: string;
  retail_prices: {
    retail_price_cents_usd?: number;
    retail_price_cents_eur?: number;
    retail_price_cents_gbp?: number;
    [key: string]: number | undefined;
  };
  link: string;
  sizes: Array<{ presentation: string; value: number }>;
}