import React from 'react';
import { Phone, ShieldAlert, MapPin, Clock } from 'lucide-react';
import { PoliceDesk, Coordinates } from '../../types/phase3';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoBadge } from '../common/DemoBadge';
import { NavigateButton } from '../common/NavigateButton';

interface PoliceDeskCardProps {
  desk: PoliceDesk;
  userCoords?: Coordinates | null;
  distanceKm?: number;
}

export const PoliceDeskCard: React.FC<PoliceDeskCardProps> = ({
  desk,
  userCoords,
  distanceKm,
}) => {
  const { isTe } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {isTe ? desk.nameTe : desk.nameEn}
              </h3>
              {desk.officerInCharge && (
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  👮 {desk.officerInCharge}
                </p>
              )}
            </div>
          </div>
          <DemoBadge />
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {isTe ? desk.descTe : desk.descEn}
        </p>

        <div className="space-y-1.5 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{isTe ? desk.addressTe : desk.addressEn}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{desk.operatingHours}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {(isTe ? desk.serviceLabelsTe : desk.serviceLabelsEn).map((srv, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100"
            >
              {srv}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={`tel:${desk.phone}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors border border-indigo-200"
        >
          <Phone className="w-3.5 h-3.5 text-indigo-600" />
          <span>{desk.phone}</span>
        </a>

        <div className="flex items-center gap-2">
          {distanceKm !== undefined && (
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              📍 {distanceKm} km
            </span>
          )}
          <NavigateButton
            coordinates={desk.coordinates}
            size="sm"
            userCoords={userCoords}
          />
        </div>
      </div>
    </div>
  );
};
