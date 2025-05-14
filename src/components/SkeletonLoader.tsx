// src/components/SkeletonLoader.tsx
import React from 'react';

export function SkeletonLoader() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#f0f0f0] animate-pulse">
      <div className="h-64 bg-[#f5f5f5]"></div>
      <div className="p-4">
        <div className="h-5 bg-[#f5f5f5] rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-[#f5f5f5] rounded w-1/2 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-[#f5f5f5] rounded w-1/3"></div>
          <div className="h-3 bg-[#f5f5f5] rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

// Erstellen Sie auch eine Grid-Version für mehrere Skeletons
export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonLoader key={index} />
      ))}
    </div>
  );
}