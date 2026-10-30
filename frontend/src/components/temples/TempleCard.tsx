import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Sparkles } from 'lucide-react';
import { Temple, Coordinates } from '../../types/phase2';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoBadge } from '../common/DemoBadge';
import { NavigateButton } from '../common/NavigateButton';

interface TempleCardProps {
  temple: Temple;
  userCoords?: Coordinates | null;
  distanceKm?: number;
}

export const TempleCard: React.FC<TempleCardProps> = ({
  temple,
  userCoords,
  distanceKm,
}) => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/temples/${temple.id}`)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={temple.imageUrl}
          alt={isTe ? temple.nameTe : temple.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 bg-amber-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            {temple.deity}
          </span>
          {temple.isDemo && <DemoBadge />}
        </div>

        {distanceKm !== undefined && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
            📍 {distanceKm} km
          </div>
        )}

        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-bold text-lg drop-shadow-sm">
            {isTe ? temple.nameTe : temple.nameEn}
          </h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {isTe ? temple.descTe : temple.descEn}
          </p>

          <div className="mt-3 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{temple.timings}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{isTe ? temple.addressTe : temple.addressEn}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/temples/${temple.id}`);
            }}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700"
          >
            {isTe ? 'ఆలయ విశేషాలు →' : 'Temple Details →'}
          </button>
          <NavigateButton
            coordinates={temple.coordinates}
            size="sm"
            userCoords={userCoords}
          />
        </div>
      </div>
    </div>
  );
};
