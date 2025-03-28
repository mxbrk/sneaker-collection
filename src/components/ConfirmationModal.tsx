// src/components/ConfirmationModal.tsx
import React from 'react';
import { Button } from './ui';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="absolute inset-0 bg-transparent"
        onClick={onCancel}
        aria-hidden="true"
      ></div>
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#171717] mb-2">{title}</h2>
          <p className="text-[#737373] mb-6">{message}</p>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-[#e5e5e5] rounded-lg text-[#171717] hover:bg-[#f5f5f5] transition-colors"
            >
              {cancelLabel}
            </button>
            <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}