import React from 'react';
import {
  Droplets,
  HelpCircle,
  Cross,
  Coffee,
  Shield,
  CreditCard,
  Clock,
  MapPin,
  Phone,
} from 'lucide-react';
import { Facility, Coordinates } from '../../types/phase2';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoBadge } from '../common/DemoBadge';
import { NavigateButton } from '../common/NavigateButton';

interface FacilityCardProps {
  facility: Facility;
  userCoords?: Coordinates | null;
  distanceKm?: number;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  userCoords,
  distanceKm,
}) => {
  const { isTe } = useLanguage();

  const getCategoryIcon = (cat: Facility['category']) => {
    switch (cat) {
      case 'drinking_water':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'medical':
        return <Cross className="w-5 h-5 text-red-600" />;
      case 'police':
        return <Shield className="w-5 h-5 text-indigo-600" />;
      case 'food_stall':
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'atm':
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-godavari-blue-400 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              {getCategoryIcon(facility.category)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                {isTe ? facility.nameTe : facility.nameEn}
              </h3>
              <span className="text-xs font-semibold text-godavari-blue-600">
                {isTe ? facility.categoryLabelTe : facility.categoryLabelEn}
              </span>
            </div>
          </div>
          <DemoBadge />
        </div>

        <div className="space-y-1.5 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{isTe ? facility.addressTe : facility.addressEn}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{facility.operatingHours}</span>
            {facility.isOpen && (
              <span className="ml-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {isTe ? 'ప్రస్తుతం అందుబాటులో ఉంది' : 'Open'}
              </span>
            )}
          </div>
          {facility.contactNumber && (
            <div className="flex items-center gap-1.5 text-godavari-blue-700 font-medium">
              <Phone className="w-3.5 h-3.5" />
              <span>{facility.contactNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          {distanceKm !== undefined ? `📍 ${distanceKm} km away` : ''}
        </span>
        <NavigateButton
          coordinates={facility.coordinates}
          size="sm"
          userCoords={userCoords}
        />
      </div>
    </div>
  );
};
