// src/components/Label.tsx
import React from 'react';
import { getLabelByValue } from '@/lib/labels';

interface LabelProps {
  value: string;
  size?: 'sm' | 'md';
  onRemove?: () => void;
}

export default function Label({ value, size = 'md', onRemove }: LabelProps) {
  const labelInfo = getLabelByValue(value);
  
  if (!labelInfo) return null;
  
  const { label, color } = labelInfo;
  
  // Create color styles with opacity
  const bgColor = `${color}1A`; // 10% opacity for background
  const textColor = color;
  const borderColor = `${color}40`; // 25% opacity for border
  
  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${
        size === 'sm' ? 'text-xs py-0.5 px-1.5' : 'text-xs'
      }`}
      style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        borderColor: borderColor
      }}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 inline-flex items-center justify-center rounded-full hover:bg-white/20"
          aria-label={`Remove ${label} label`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
    </span>
  );
}

export function LabelGroup({ labels, size = 'md', onRemoveLabel }: { 
  labels: string[];
  size?: 'sm' | 'md';
  onRemoveLabel?: (label: string) => void;
}) {
  if (!labels || labels.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1">
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