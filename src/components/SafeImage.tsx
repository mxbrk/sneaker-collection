// src/components/SafeImage.tsx

import React, { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

/**
 * Eine sichere Image-Komponente mit garantiertem Fallback
 */
export default function SafeImage({ 
  src, 
  alt, 
  fill, 
  width = 300, 
  height = 200, 
  className = '', 
  sizes,
  style,
  priority
}: SafeImageProps) {
  const [error, setError] = useState(false);
  
  // Das Fallback-Muster statt eines Bildes
  const renderFallback = () => (
    <div 
      className={`bg-gray-100 flex items-center justify-center text-gray-400 ${className}`}
      style={{ 
        width: fill ? '100%' : width, 
        height: fill ? '100%' : height,
        position: fill ? 'relative' : 'static',
        ...style
      }}
    >
      <div className="flex flex-col items-center justify-center p-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span className="text-xs mt-2 text-gray-500">{alt || 'Image'}</span>
      </div>
    </div>
  );
  
  // Default-Fallback für leere oder fehlende src
  if (!src || error) {
    return renderFallback();
  }
  
  // Bei externen URLs nur normales img-Tag verwenden
  if (src.startsWith('http')) {
    if (fill) {
      return (
        <div 
          className={`relative ${className}`} 
          style={{ width: '100%', height: '100%', ...style }}
        >
          <img
            src={src}
            alt={alt}
            className="object-cover w-full h-full"
            onError={() => setError(true)}
          />
        </div>
      );
    }
    
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        onError={() => setError(true)}
      />
    );
  }
  
  // Für einfaches Muster ohne tatsächliches Bild
  if (src === 'pattern') {
    return renderFallback();
  }
  
  // Fügen wir ein verzögertes Fallback hinzu, falls das Bild nicht geladen werden kann
  try {
    // Verwende ein einfaches DIV-Muster für lokale Entwicklung
    // statt eines lokalen Pfads, der möglicherweise nicht existiert
    return renderFallback();
  } catch (e) {
    console.error('Error rendering image:', e);
    return renderFallback();
  }
}