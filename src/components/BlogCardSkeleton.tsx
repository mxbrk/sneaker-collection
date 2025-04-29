// src/components/BlogCardSkeleton.tsx

// Default export for regular blog card skeleton
export default function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] h-full animate-pulse flex flex-col">
      {/* Card Top Color Accent */}
      <div className="h-2 bg-gradient-to-r from-[#fae5e1] to-[#fae5e1]"></div>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Date Badge Skeleton */}
        <div className="w-32 h-6 bg-[#f5f5f5] rounded-full mb-4"></div>
        
        {/* Title Skeleton */}
        <div className="h-7 bg-[#f5f5f5] rounded-md mb-2"></div>
        <div className="h-7 bg-[#f5f5f5] rounded-md mb-4 w-3/4"></div>
        
        {/* Description Skeleton */}
        <div className="h-4 bg-[#f5f5f5] rounded-md mb-2"></div>
        <div className="h-4 bg-[#f5f5f5] rounded-md mb-2"></div>
        <div className="h-4 bg-[#f5f5f5] rounded-md mb-2"></div>
        <div className="h-4 bg-[#f5f5f5] rounded-md mb-6 w-2/3"></div>
        
        {/* Read More Link Skeleton */}
        <div className="w-28 h-5 bg-[#f5f5f5] rounded-md mt-auto"></div>
      </div>
    </div>
  );
}

// Named export for the featured article skeleton
export function FeaturedArticleSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f0f0f0] animate-pulse">
      <div className="grid md:grid-cols-5">
        {/* Left Color Column */}
        <div className="hidden md:block md:col-span-1 bg-[#fae5e1]">
          <div className="w-full h-full flex items-center justify-center min-h-[240px]"></div>
        </div>
        
        {/* Content Column */}
        <div className="p-8 md:col-span-4">
          {/* Date Badge Skeleton */}
          <div className="w-32 h-6 bg-[#f5f5f5] rounded-full mb-4"></div>
          
          {/* Title Skeleton */}
          <div className="h-8 bg-[#f5f5f5] rounded-md mb-3"></div>
          <div className="h-8 bg-[#f5f5f5] rounded-md mb-4 w-3/4"></div>
          
          {/* Description Skeleton */}
          <div className="h-4 bg-[#f5f5f5] rounded-md mb-2"></div>
          <div className="h-4 bg-[#f5f5f5] rounded-md mb-2"></div>
          <div className="h-4 bg-[#f5f5f5] rounded-md mb-6 w-2/3"></div>
          
          {/* Button Skeleton */}
          <div className="w-36 h-10 bg-[#f5f5f5] rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}