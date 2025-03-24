// src/components/SneakerCard.tsx
import { Sneaker } from '@/types/sneakers';
import Image from 'next/image';

interface SneakerCardProps {
  sneaker: Sneaker;
}

export default function SneakerCard({ sneaker }: SneakerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[#f0f0f0]">
      <div className="relative h-48 bg-[#ffffff] overflow-hidden p-2">
        {sneaker.image ? (
          <Image
            src={sneaker.image}
            alt={`${sneaker.title} - ${sneaker.sku || 'Sneaker'}`}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain hover:scale-105 transition-transform duration-300"
            style={{ objectPosition: 'center' }}
            quality={85}
            loading="eager"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdmN2Y3Ii8+PC9zdmc+"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d0d0d0]">
            No Image Available
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-[#171717] line-clamp-2 mb-1">
          {sneaker.title || "Unnamed Sneaker"}
        </h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-mono text-[#737373]">
            {sneaker.sku}
          </span>
          {sneaker.retailPrice ? (
            <span className="text-[#d14124] font-medium">
              ${sneaker.retailPrice}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}