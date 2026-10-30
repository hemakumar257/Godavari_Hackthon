import React from 'react';
import { Trash2, ChevronUp, ChevronDown, Clock, Navigation } from 'lucide-react';
import { YatraStop } from '../../types/phase5';
import { useLanguage } from '../../hooks/useLanguage';

interface ItineraryStopCardProps {
  stop: YatraStop;
  index: number;
  totalStops: number;
  onRemove: (stopId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onUpdateNotes: (stopId: string, notes: string) => void;
  onUpdateDuration: (stopId: string, durationMinutes: number) => void;
  onUpdateArrivalTime: (stopId: string, time: string) => void;
}

export const ItineraryStopCard: React.FC<ItineraryStopCardProps> = ({
  stop,
  index,
  totalStops,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpdateDuration,
  onUpdateArrivalTime,
}) => {
  const { isTe } = useLanguage();

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${stop.coordinates.lat},${stop.coordinates.lng}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Sequence & Details */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-godavari-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
          {index + 1}
        </div>

        <img
          src={stop.thumbnailUrl}
          alt={isTe ? stop.nameTe : stop.nameEn}
          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
        />

        <div className="min-w-0 space-y-1 flex-1">
          <div className="text-[11px] font-bold text-godavari-turquoise-700 uppercase tracking-wide font-telugu">
            {isTe ? stop.categoryLabelTe : stop.categoryLabelEn}
          </div>
          <h4 className="font-bold text-slate-900 text-sm truncate font-telugu">
            {isTe ? stop.nameTe : stop.nameEn}
          </h4>
          <div className="text-[11px] text-slate-400 truncate">
            {isTe ? stop.addressTe : stop.addressEn}
          </div>

          {/* Quick Schedule inputs */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={stop.plannedArrivalTime || ''}
                onChange={(e) => onUpdateArrivalTime(stop.stopId, e.target.value)}
                placeholder="09:00 AM"
                className="w-20 px-1.5 py-0.5 border border-slate-200 rounded text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-godavari-turquoise-500"
                title="Planned arrival time"
              />
            </div>

            <div className="flex items-center gap-1 text-slate-600">
              <span className="text-[11px] text-slate-400">{isTe ? 'సమయం:' : 'Duration:'}</span>
              <select
                value={stop.estimatedDurationMinutes}
                onChange={(e) => onUpdateDuration(stop.stopId, Number(e.target.value))}
                className="px-1.5 py-0.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-godavari-turquoise-500 font-telugu"
              >
                <option value={30}>30 {isTe ? 'నిమి' : 'mins'}</option>
                <option value={60}>1 {isTe ? 'గంట' : 'hour'}</option>
                <option value={90}>1.5 {isTe ? 'గంటలు' : 'hours'}</option>
                <option value={120}>2 {isTe ? 'గంటలు' : 'hours'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <button
          type="button"
          onClick={handleNavigate}
          className="p-2 text-godavari-blue-700 hover:bg-godavari-blue-50 rounded-lg transition-colors"
          title={isTe ? 'గూగుల్ మ్యాప్స్‌లో దారి' : 'Google Maps Directions'}
        >
          <Navigation className="w-4 h-4" />
        </button>

        {/* Reordering */}
        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMoveUp(index)}
            className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded transition-colors"
            title="Move Up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={index === totalStops - 1}
            onClick={() => onMoveDown(index)}
            className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded transition-colors"
            title="Move Down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onRemove(stop.stopId)}
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors ml-1"
          title={isTe ? 'తీసివేయి' : 'Remove Stop'}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
