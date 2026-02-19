"use client";

import React from "react";

interface SnackbarProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

export default function Snackbar({ message, actionLabel = "Undo", onAction, onClose }: SnackbarProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-gray-900 text-white px-4 py-3 rounded shadow-lg flex items-center gap-4">
        <div className="text-sm">{message}</div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-white text-gray-900 px-3 py-1 rounded text-sm font-medium hover:brightness-95"
          >
            {actionLabel}
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="text-gray-300 hover:text-white text-sm">✕</button>
        )}
      </div>
    </div>
  );
}
