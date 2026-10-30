import React from 'react';
import { Calendar, Clock, MapPin, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PushkaraluEvent, Coordinates } from '../../types/phase2';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoBadge } from '../common/DemoBadge';
import { NavigateButton } from '../common/NavigateButton';

interface EventCardProps {
  event: PushkaraluEvent;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  userCoords?: Coordinates | null;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isSaved = false,
  onToggleSave,
  userCoords,
}) => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-godavari-blue-400 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Image thumbnail & Tags */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={event.imageUrl}
          alt={isTe ? event.titleTe : event.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-godavari-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {isTe ? event.categoryLabelTe : event.categoryLabelEn}
          </span>
          <div className="flex items-center gap-1.5">
            {event.isDemo && <DemoBadge />}
            {onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(event.id);
                }}
                className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                  isSaved
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 hover:bg-white text-slate-700'
                }`}
                title={isSaved ? 'Saved' : 'Save'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Date on image bottom */}
        <div className="absolute bottom-2.5 left-3 text-white text-xs flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-godavari-gold-400" />
          <span>{event.date}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 group-hover:text-godavari-blue-600 transition-colors line-clamp-1 text-base">
            {isTe ? event.titleTe : event.titleEn}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {isTe ? event.descTe : event.descEn}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          {/* Time & Venue */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{event.startTime} - {event.endTime}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{isTe ? event.venueTe : event.venueEn}</span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/events/${event.id}`);
              }}
              className="text-xs font-semibold text-godavari-blue-600 hover:text-godavari-blue-800"
            >
              {isTe ? 'వివరాలు చూడండి →' : 'View Details →'}
            </button>
            <NavigateButton
              coordinates={event.coordinates}
              size="sm"
              userCoords={userCoords}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
