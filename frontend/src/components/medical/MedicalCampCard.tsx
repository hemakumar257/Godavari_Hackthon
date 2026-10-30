import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Clock, ShieldCheck, HeartPulse, ExternalLink } from 'lucide-react';
import { MedicalCamp, Coordinates } from '../../types/phase3';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoBadge } from '../common/DemoBadge';
import { NavigateButton } from '../common/NavigateButton';

interface MedicalCampCardProps {
  camp: MedicalCamp;
  userCoords?: Coordinates | null;
  distanceKm?: number;
}

export const MedicalCampCard: React.FC<MedicalCampCardProps> = ({
  camp,
  userCoords,
  distanceKm,
}) => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/medical-assistance/camp/${camp.id}`)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-rose-400 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Camp Image / Header */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={camp.imageUrl}
          alt={isTe ? camp.nameTe : camp.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {camp.status === '24_hours' ? '24x7' : camp.status}
          </span>
          {camp.isDemo && <DemoBadge />}
        </div>

        {distanceKm !== undefined && (
          <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full font-medium">
            📍 {distanceKm} km {isTe ? 'దూరం' : 'away'}
          </div>
        )}

        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-bold text-base sm:text-lg drop-shadow-xs">
            {isTe ? camp.nameTe : camp.nameEn}
          </h3>
        </div>
      </div>

      {/* Body info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {isTe ? camp.descTe : camp.descEn}
          </p>

          {camp.doctorInCharge && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium text-slate-800">{camp.doctorInCharge}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{camp.operatingHours}</span>
          </div>

          {/* Service Pills */}
          <div className="flex flex-wrap gap-1 mt-3">
            {(isTe ? camp.serviceLabelsTe : camp.serviceLabelsEn).slice(0, 4).map((srv, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100 flex items-center gap-1"
              >
                <HeartPulse className="w-2.5 h-2.5 text-rose-500" />
                <span>{srv}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <a
            href={`tel:${camp.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors border border-rose-200"
          >
            <Phone className="w-3.5 h-3.5 text-rose-600" />
            <span>{camp.phone}</span>
          </a>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/medical-assistance/camp/${camp.id}`);
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
              title={isTe ? 'వివరాలు' : 'Details'}
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <NavigateButton
              coordinates={camp.coordinates}
              size="sm"
              userCoords={userCoords}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
