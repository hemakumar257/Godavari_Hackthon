import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, PlusCircle, Check } from 'lucide-react';
import { HeritageLocation } from '../../types/phase5';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoBadge } from '../common/DemoBadge';

interface HeritageCardProps {
  location: HeritageLocation;
  onAddToYatra?: (location: HeritageLocation) => void;
  isAddedToYatra?: boolean;
}

export const HeritageCard: React.FC<HeritageCardProps> = ({
  location,
  onAddToYatra,
  isAddedToYatra,
}) => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/heritage/${location.slug}`)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-godavari-blue-400 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
        <img
          src={location.imageUrl}
          alt={isTe ? location.nameTe : location.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-godavari-blue-900/90 text-godavari-turquoise-200 backdrop-blur-xs border border-godavari-turquoise-700/30">
            {isTe ? location.categoryLabelTe : location.categoryLabelEn}
          </span>
          <DemoBadge />
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <h3 className="font-bold text-base sm:text-lg line-clamp-1 drop-shadow-sm font-telugu">
            {isTe ? location.nameTe : location.nameEn}
          </h3>
        </div>
      </div>

      {/* Body info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-telugu">
            {isTe ? location.shortDescTe : location.shortDescEn}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{isTe ? location.addressTe : location.addressEn}</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToYatra) onAddToYatra(location);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors font-telugu ${
              isAddedToYatra
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 hover:bg-godavari-blue-50 text-slate-700 hover:text-godavari-blue-800'
            }`}
          >
            {isAddedToYatra ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isTe ? 'చేర్చబడింది' : 'In Yatra'}</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5 text-godavari-blue-600" />
                <span>{isTe ? '+ యాత్రకు చేర్చు' : '+ Add to Yatra'}</span>
              </>
            )}
          </button>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-godavari-blue-700 group-hover:text-godavari-turquoise-600 transition-colors font-telugu">
            <span>{isTe ? 'వివరాలు' : 'Explore'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
