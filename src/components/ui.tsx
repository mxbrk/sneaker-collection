import React from 'react';

// src/components/ui.tsx - Button Komponente

export function Button({
  children,
  type = 'button',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
}) {
  return (
    <button
      type={type}
      className={`bg-[#d14124] text-white rounded-lg py-2 px-4 font-medium text-sm transition-colors hover:bg-[#b93a20] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export function Input({
  label,
  error,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  const id = `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d14124] focus:border-[#d14124] bg-white ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function FormContainer({
  children,
  title,
  subtitle,
  onSubmit,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-sm border border-[#f0f0f0]">
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-foreground/70 mt-2">{subtitle}</p>}
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
        </form>
      </div>
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
      {message}
    </div>
  );
}

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  
  return (
    <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
      {message}
    </div>
  );
}