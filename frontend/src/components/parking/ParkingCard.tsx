import React from 'react';
import { Car, MapPin, Gauge } from 'lucide-react';
import { ParkingLocation, Coordinates } from '../../types/phase2';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoBadge } from '../common/DemoBadge';
import { NavigateButton } from '../common/NavigateButton';

interface ParkingCardProps {
  parking: ParkingLocation;
  userCoords?: Coordinates | null;
  distanceKm?: number;
}

export const ParkingCard: React.FC<ParkingCardProps> = ({
  parking,
  userCoords,
  distanceKm,
}) => {
  const { isTe } = useLanguage();

  const getStatusBadge = (status: ParkingLocation['status']) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {isTe ? 'ఖాళీ స్థలం ఉంది (Available)' : 'Slots Available'}
          </span>
        );
      case 'filling':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {isTe ? 'త్వరగా నిండుతోంది (Filling)' : 'Filling Fast'}
          </span>
        );
      case 'full':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {isTe ? 'పూర్తిగా నిండింది (Full)' : 'Full'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
            {isTe ? 'తెలియదు' : 'Unknown'}
          </span>
        );
    }
  };

  const occupancyPercent =
    parking.totalCapacity > 0
      ? Math.round(((parking.totalCapacity - parking.availableSlots) / parking.totalCapacity) * 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-godavari-blue-400 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="p-5 space-y-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isTe ? parking.nameTe : parking.nameEn}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{isTe ? parking.addressTe : parking.addressEn}</span>
            </p>
          </div>
          <DemoBadge />
        </div>

        {/* Status + Capacity Bar */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            {getStatusBadge(parking.status)}
            <span className="font-semibold text-slate-700">
              {parking.availableSlots} / {parking.totalCapacity} {isTe ? 'ఖాళీలు' : 'slots free'}
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                occupancyPercent > 85
                  ? 'bg-red-500'
                  : occupancyPercent > 60
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Vehicle types & Distance to nearest Ghat */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-godavari-blue-600" />
            <span>{parking.vehicleTypes.join(', ')}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <span>~{parking.distanceToGhatKm} km to {parking.nearestGhatEn}</span>
          </div>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          {distanceKm !== undefined
            ? `📍 ${distanceKm} km from you`
            : isTe
            ? 'రాజమహేంద్రవరం ప్రాంతం'
            : 'Rajahmundry Area'}
        </span>
        <NavigateButton
          coordinates={parking.coordinates}
          size="sm"
          travelMode="driving"
          userCoords={userCoords}
        />
      </div>
    </div>
  );
};
