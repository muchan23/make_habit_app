'use client';

import { AlertCircle, X } from 'lucide-react';

interface ErrorDisplayProps {
    error: string | null;
    onDismiss?: () => void;
    className?: string;
}

export function ErrorDisplay({ error, onDismiss, className = '' }: ErrorDisplayProps) {
    if (!error) return null;
  
    return (
      <div className={`bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center justify-between ${className}`}>
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }