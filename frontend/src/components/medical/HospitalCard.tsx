import React from 'react';
import { Phone, Building2, MapPin, Bed, Activity } from 'lucide-react';
import { Hospital, Coordinates } from '../../types/phase3';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoBadge } from '../common/DemoBadge';
import { NavigateButton } from '../common/NavigateButton';

interface HospitalCardProps {
  hospital: Hospital;
  userCoords?: Coordinates | null;
  distanceKm?: number;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  userCoords,
  distanceKm,
}) => {
  const { isTe } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-godavari-blue-400 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-godavari-blue-50 text-godavari-blue-700 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {isTe ? hospital.nameTe : hospital.nameEn}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-semibold text-godavari-blue-600">
                  {hospital.isGovernment ? (isTe ? 'ప్రభుత్వ ఆసుపత్రి' : 'Government Hospital') : (isTe ? 'ప్రైవేట్ కేర్' : 'Private Facility')}
                </span>
                {hospital.hasEmergency && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-full">
                    <Activity className="w-2.5 h-2.5" />
                    24x7 Casualty
                  </span>
                )}
              </div>
            </div>
          </div>
          <DemoBadge />
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {isTe ? hospital.descTe : hospital.descEn}
        </p>

        <div className="space-y-1.5 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{isTe ? hospital.addressTe : hospital.addressEn}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              {hospital.bedCapacity} {isTe ? 'పడకలు' : 'Beds'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {hospital.services.slice(0, 4).map((srv, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
            >
              {srv}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <a
            href={`tel:${hospital.emergencyPhone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
            title={isTe ? 'అత్యవసర కాల్' : 'Emergency Call'}
          >
            <Phone className="w-3 h-3" />
            <span>{isTe ? 'అత్యవసరం' : 'Emergency'}: {hospital.emergencyPhone}</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          {distanceKm !== undefined && (
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              📍 {distanceKm} km
            </span>
          )}
          <NavigateButton
            coordinates={hospital.coordinates}
            size="sm"
            userCoords={userCoords}
          />
        </div>
      </div>
    </div>
  );
};
