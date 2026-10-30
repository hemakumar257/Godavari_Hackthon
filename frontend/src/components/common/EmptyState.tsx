import React from 'react';
import { SearchX } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface EmptyStateProps {
  titleTe?: string;
  titleEn?: string;
  descTe?: string;
  descEn?: string;
  actionTextTe?: string;
  actionTextEn?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  titleTe = 'ఫలితాలు కనుగొనబడలేదు',
  titleEn = 'No results found',
  descTe = 'మీరు ఎంచుకున్న ఫిల్టర్‌లు లేదా వెతుకుతున్న పదాలకు సరిపోలిన సమాచారం లేదు.',
  descEn = 'Try adjusting your filters or search terms to find what you are looking for.',
  actionTextTe,
  actionTextEn,
  onAction,
}) => {
  const { isTe } = useLanguage();

  return (
    <div className="py-12 px-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {isTe ? titleTe : titleEn}
      </h3>
      <p className="text-sm text-slate-500 mb-6">
        {isTe ? descTe : descEn}
      </p>
      {onAction && actionTextTe && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-godavari-blue-600 hover:bg-godavari-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isTe ? actionTextTe : actionTextEn}
        </button>
      )}
    </div>
  );
};
