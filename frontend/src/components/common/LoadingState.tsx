import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface LoadingStateProps {
  messageTe?: string;
  messageEn?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  messageTe = 'సమాచారం లోడ్ అవుతోంది...',
  messageEn = 'Loading information...',
}) => {
  const { isTe } = useLanguage();

  return (
    <div className="py-16 text-center flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-godavari-blue-600 animate-spin mb-4" />
      <p className="text-sm font-medium text-slate-600">
        {isTe ? messageTe : messageEn}
      </p>
    </div>
  );
};
