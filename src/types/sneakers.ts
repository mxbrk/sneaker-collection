// src/types/sneakers.ts
// This might already include all fields, but make sure it has these:
export interface Sneaker {
  id: string;
  title: string;
  sku: string;
  image: string;
  brand: string;
  colorway: string;
  retailPrice?: number;
  releaseDate?: string;
}

export interface SneakerApiResponse {
  total: number;
  page: number;
  pages: number;
  data: Sneaker[];
}