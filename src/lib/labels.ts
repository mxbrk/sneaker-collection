// src/lib/labels.ts
export const sneakerLabels = [
    { value: 'need-to-clean', label: 'Need to Clean', color: '#f59e0b' }, // Amber
    { value: 'want-to-sell', label: 'Want to Sell', color: '#10b981' },   // Emerald
    { value: 'favorite', label: 'Favorite', color: '#ec4899' },           // Pink
    { value: 'worn-recently', label: 'Worn Recently', color: '#3b82f6' }, // Blue
    { value: 'not-worn', label: 'Not Worn', color: '#6366f1' },           // Indigo
    { value: 'damaged', label: 'Damaged', color: '#ef4444' },             // Red
    { value: 'restored', label: 'Restored', color: '#8b5cf6' },           // Violet
    { value: 'limited-edition', label: 'Limited Edition', color: '#f97316' }, // Orange
  ];
  
  // Function to get valid label values for schema validation
  export function getValidLabelValues(): string[] {
    return sneakerLabels.map(label => label.value);
  }
  
  export function getLabelByValue(value: string) {
    return sneakerLabels.find(label => label.value === value);
  }
  
  export function getLabelColor(value: string) {
    const label = getLabelByValue(value);
    return label ? label.color : '#737373'; // Default gray color
  }