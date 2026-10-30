import React from 'react';

interface SectionHeadingProps {
  titleTe: string;
  titleEn: string;
  subtitleTe?: string;
  subtitleEn?: string;
  actionText?: string;
  actionHref?: string;
  isTe?: boolean;
  centered?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  titleTe,
  titleEn,
  subtitleTe,
  subtitleEn,
  actionText,
  actionHref,
  isTe = true,
  centered = false,
}) => {
  return (
    <div className={`mb-8 ${centered ? 'text-center' : 'flex flex-col md:flex-row md:items-end md:justify-between'}`}>
      <div className={centered ? 'max-w-2xl mx-auto' : ''}>
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1 w-6 bg-godavari-turquoise-500 rounded-full inline-block"></span>
          <span className="text-xs uppercase tracking-wider font-semibold text-godavari-turquoise-700">
            {isTe ? 'గోదావరి పుష్కరాలు 2027 • ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'GODAVARI PUSHKARALU 2027 • GOVT. OF ANDHRA PRADESH'}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-godavari-blue-950 tracking-tight font-telugu leading-snug">
          {isTe ? titleTe : titleEn}
        </h2>
        {(subtitleTe || subtitleEn) && (
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-telugu leading-relaxed">
            {isTe ? subtitleTe : subtitleEn}
          </p>
        )}
      </div>

      {actionText && actionHref && (
        <div className="mt-4 md:mt-0">
          <a
            href={actionHref}
            className="inline-flex items-center text-sm font-semibold text-godavari-blue-700 hover:text-godavari-turquoise-600 transition-colors group"
          >
            {actionText}
            <svg
              className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};
