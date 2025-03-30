// Update src/components/Label.tsx with this touch-friendly version

import React, { useState } from 'react';
import { getLabelByValue } from '@/lib/labels';

interface LabelProps {
  value: string;
  size?: 'sm' | 'md';
  onRemove?: () => void;
}

export default function Label({ value, size = 'md', onRemove }: LabelProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const labelInfo = getLabelByValue(value);
  
  if (!labelInfo) return null;
  
  const { label, color } = labelInfo;
  
  // Size based on the prop
  const circleSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  
  // Handle touch events for mobile devices
  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    setShowTooltip(true);
    
    // Hide tooltip after 2 seconds
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };
  
  return (
    <div 
      className="inline-flex items-center group relative"
      title={label}
    >
      {/* Circle with label color */}
      <div 
        className={`${circleSize} rounded-full ${onRemove ? 'cursor-pointer' : ''}`}
        style={{ backgroundColor: color }}
        onClick={onRemove ? (e) => {
          e.stopPropagation();
          onRemove();
        } : undefined}
        onTouchStart={handleTouch}
      />
      
      {/* Tooltip that shows on hover or tap */}
      <span 
        className={`absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 transition-opacity whitespace-nowrap z-10 ${
          showTooltip ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export function LabelGroup({ labels, size = 'md', onRemoveLabel }: { 
  labels: string[];
  size?: 'sm' | 'md';
  onRemoveLabel?: (label: string) => void;
}) {
  if (!labels || labels.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1.5">
      {labels.map((label) => (
        <Label 
          key={label} 
          value={label} 
          size={size}
          onRemove={onRemoveLabel ? () => onRemoveLabel(label) : undefined}
        />
      ))}
    </div>
  );
}