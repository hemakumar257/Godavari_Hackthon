import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Accessibility, ShieldCheck, Shirt, ExternalLink } from 'lucide-react';
import { Ghat, Coordinates } from '../../types/phase2';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoBadge } from '../common/DemoBadge';
import { NavigateButton } from '../common/NavigateButton';

interface GhatCardProps {
  ghat: Ghat;
  userCoords?: Coordinates | null;
  distanceKm?: number;
}

export const GhatCard: React.FC<GhatCardProps> = ({
  ghat,
  userCoords,
  distanceKm,
}) => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  // Crowd status pill
  const getCrowdBg = (status: Ghat['crowdStatus']) => {
    switch (status) {
      case 'low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getCrowdLabel = (status: Ghat['crowdStatus']) => {
    switch (status) {
      case 'low':
        return isTe ? 'తక్కువ రద్దీ (Low)' : 'Low Crowd';
      case 'moderate':
        return isTe ? 'మధ్యస్థ రద్దీ (Moderate)' : 'Moderate Crowd';
      case 'high':
        return isTe ? 'అధిక రద్దీ (High)' : 'High Crowd';
      default:
        return isTe ? 'సమాచారం లేదు' : 'Unknown';
    }
  };

  // Status pill
  const getStatusBadge = (status: Ghat['status']) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {isTe ? 'ప్రస్తుతం తెరిచి ఉంది' : 'Open'}
          </span>
        );
      case 'restricted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {isTe ? 'పరిమిత ప్రవేశం' : 'Restricted'}
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {isTe ? 'తాత్కాలికంగా మూసివేయబడింది' : 'Temporarily Closed'}
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => navigate(`/explore/${ghat.id}`)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-godavari-blue-400 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Ghat Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={ghat.imageUrl}
          alt={isTe ? ghat.nameTe : ghat.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {getStatusBadge(ghat.status)}
          {ghat.isDemo && <DemoBadge />}
        </div>

        {/* Distance if available */}
        {distanceKm !== undefined && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
            📍 {distanceKm} km {isTe ? 'దూరం' : 'away'}
          </div>
        )}

        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-bold text-lg drop-shadow-sm">
            {isTe ? ghat.nameTe : ghat.nameEn}
          </h3>
        </div>
      </div>

      {/* Body info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {isTe ? ghat.descTe : ghat.descEn}
          </p>

          {/* Crowd indicator bar */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {isTe ? 'రద్దీ స్థితి (డెమో):' : 'Crowd Level (Demo):'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getCrowdBg(ghat.crowdStatus)}`}>
                {getCrowdLabel(ghat.crowdStatus)}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  ghat.crowdStatus === 'low'
                    ? 'bg-emerald-500'
                    : ghat.crowdStatus === 'moderate'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${ghat.crowdPercentage}%` }}
              />
            </div>
          </div>

          {/* Amenities tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {ghat.isAccessible && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                <Accessibility className="w-3 h-3" />
                {isTe ? 'దివ్యాంగులకు అనుకూలం' : 'Accessible'}
              </span>
            )}
            {ghat.hasChangingRooms && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                <Shirt className="w-3 h-3" />
                {isTe ? 'బట్టలు మార్చుకునే గదులు' : 'Changing Rooms'}
              </span>
            )}
            {ghat.hasMedicalCamp && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" />
                {isTe ? 'వైద్య శిబిరం' : 'Medical Camp'}
              </span>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{ghat.nearbyLandmark}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/explore/${ghat.id}`);
              }}
              className="p-1.5 text-slate-400 hover:text-godavari-blue-600 rounded-lg hover:bg-slate-100"
              title={isTe ? 'పూర్తి వివరాలు' : 'Full details'}
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <NavigateButton
              coordinates={ghat.coordinates}
              size="sm"
              userCoords={userCoords}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
