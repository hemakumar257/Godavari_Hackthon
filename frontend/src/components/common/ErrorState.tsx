import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface ErrorStateProps {
  messageTe?: string;
  messageEn?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  messageTe = 'సమాచారం పొందడంలో లోపం ఏర్పడింది.',
  messageEn = 'Failed to load information.',
  onRetry,
}) => {
  const { isTe } = useLanguage();

  return (
    <div className="py-12 px-4 text-center bg-red-50/60 rounded-2xl border border-red-200 max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 text-red-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-red-900 mb-1">
        {isTe ? 'లోపం జరిగింది' : 'Something went wrong'}
      </h3>
      <p className="text-sm text-red-700 mb-5">
        {isTe ? messageTe : messageEn}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-300 hover:bg-red-50 text-red-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isTe ? 'మళ్ళీ ప్రయత్నించండి' : 'Try Again'}</span>
        </button>
      )}
    </div>
  );
};
