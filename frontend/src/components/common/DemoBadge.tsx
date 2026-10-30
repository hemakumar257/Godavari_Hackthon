import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface DemoBadgeProps {
  className?: string;
  variant?: 'inline' | 'banner';
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ className = '', variant = 'inline' }) => {
  const { isTe } = useLanguage();

  if (variant === 'banner') {
    return (
      <div className={`bg-amber-500/10 border border-amber-500/30 text-amber-800 rounded-lg p-3 text-xs sm:text-sm flex items-center justify-between gap-2 ${className}`}>
        <span>
          <strong className="font-semibold uppercase tracking-wider bg-amber-500 text-white px-1.5 py-0.5 rounded text-[10px] mr-2">
            DEMO
          </strong>
          {isTe
            ? 'నమూనా సమాచారం – అధికారిక అధికారిక నవీకరణల కోసం వేచి ఉంది.'
            : 'Demonstration data – awaiting verified official updates.'}
        </span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider bg-amber-100 text-amber-800 border border-amber-300 ${className}`}
      title={isTe ? 'నమూనా సమాచారం' : 'Demonstration Data'}
    >
      DEMO
    </span>
  );
};
