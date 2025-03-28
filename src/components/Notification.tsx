// src/components/Notification.tsx
import { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
  duration?: number;
}

export default function Notification({
  message,
  type,
  onDismiss,
  duration = 3000,
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white max-w-sm animate-slide-in ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )}
        <p>{message}</p>
        <button
          onClick={onDismiss}
          className="ml-auto text-white/80 hover:text-white"
          aria-label="Close notification"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}