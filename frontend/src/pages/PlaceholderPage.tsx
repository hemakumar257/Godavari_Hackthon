import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { Badge } from '../components/common/Badge';

interface PlaceholderPageProps {
  titleTe: string;
  titleEn: string;
  subtitleTe: string;
  subtitleEn: string;
  phaseNumber: number;
  phaseName: string;
  icon: React.ElementType;
  highlightsTe: string[];
  highlightsEn: string[];
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  titleTe,
  titleEn,
  subtitleTe,
  subtitleEn,
  phaseNumber,
  phaseName,
  icon: Icon,
  highlightsTe,
  highlightsEn,
}) => {
  const { isTe } = useLanguage();

  return (
    <div className="py-16 sm:py-24 bg-slate-50 min-h-[70vh] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-elevated text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-godavari-blue-50 text-godavari-blue-700 flex items-center justify-center mb-6 shadow-sm border border-godavari-blue-100">
            <Icon className="w-8 h-8" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="turquoise" size="md">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Phase {phaseNumber}: {phaseName}
              </span>
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-godavari-blue-950 mb-3 font-telugu leading-snug">
            {isTe ? titleTe : titleEn}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto font-telugu">
            {isTe ? subtitleTe : subtitleEn}
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left mb-8">
            <h3 className="text-xs uppercase font-bold tracking-wider text-godavari-turquoise-700 mb-3 flex items-center gap-1.5 font-telugu">
              <Sparkles className="w-3.5 h-3.5" />
              {isTe ? `ఈ విభాగంలో రాబోయే ఫీచర్లు (Phase ${phaseNumber})` : `Upcoming Features in Phase ${phaseNumber}`}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-telugu">
              {(isTe ? highlightsTe : highlightsEn).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-godavari-blue-600 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-godavari-blue-900 text-white font-semibold text-sm hover:bg-godavari-blue-950 transition shadow font-telugu"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isTe ? 'ప్రధాన పేజీకి తిరిగి వెళ్లండి' : 'Return to Home'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
