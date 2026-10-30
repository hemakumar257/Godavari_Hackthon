import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Radio, Users, MapPin, Calendar, Clock } from 'lucide-react';
import { LiveStream } from '../../types/phase4';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoBadge } from '../common/DemoBadge';
import { ReminderButton } from './ReminderButton';

interface StreamCardProps {
  stream: LiveStream;
  variant?: 'grid' | 'featured';
}

export const StreamCard: React.FC<StreamCardProps> = ({ stream }) => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  const isLive = stream.status === 'LIVE';
  const isUpcoming = stream.status === 'UPCOMING';
  const isEnded = stream.status === 'ENDED';

  const formatSchedule = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(isTe ? 'te-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      onClick={() => navigate(`/live/${stream.id}`)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-rose-400 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={stream.thumbnailUrl}
          alt={isTe ? stream.titleTe : stream.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-xs animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>LIVE</span>
              </span>
            ) : isUpcoming ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold shadow-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>UPCOMING</span>
              </span>
            ) : isEnded ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 text-xs font-semibold">
                RECORDED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 text-xs font-medium">
                OFFLINE
              </span>
            )}
            <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {isTe ? stream.categoryLabelTe : stream.categoryLabelEn}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {stream.isDemo && <DemoBadge />}
          </div>
        </div>

        {/* Hover Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[1px]">
          <div className="w-12 h-12 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <PlayCircle className="w-7 h-7" />
          </div>
        </div>

        {/* Bottom Thumbnail Overlay info */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
          <span className="flex items-center gap-1 text-[11px] truncate max-w-[200px]">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{isTe ? stream.venueTe : stream.venueEn}</span>
          </span>
          {isLive && stream.viewerCount && (
            <span className="flex items-center gap-1 text-[11px] text-slate-300 bg-black/50 px-2 py-0.5 rounded-md font-mono">
              <Users className="w-3 h-3 text-rose-400" />
              {stream.viewerCount}
            </span>
          )}
          {stream.duration && (
            <span className="bg-black/75 px-1.5 py-0.5 rounded text-[11px] font-mono text-white">
              {stream.duration}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors text-base line-clamp-2 leading-snug">
            {isTe ? stream.titleTe : stream.titleEn}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {isTe ? stream.descTe : stream.descEn}
          </p>
        </div>

        {/* Schedule / Action bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {isUpcoming ? (
            <div className="flex items-center gap-1 text-xs text-amber-800 font-semibold truncate">
              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{formatSchedule(stream.scheduledStart)}</span>
            </div>
          ) : isLive ? (
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              {isTe ? 'ఇప్పుడే ప్రసారం అవుతోంది' : 'Streaming Now'}
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              {stream.recordingDate ? `Recorded: ${stream.recordingDate}` : 'Full Coverage'}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            {isUpcoming && (
              <ReminderButton
                streamId={stream.id}
                streamTitleTe={stream.titleTe}
                streamTitleEn={stream.titleEn}
                scheduledStart={stream.scheduledStart}
              />
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/live/${stream.id}`);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
            >
              {isLive
                ? isTe
                  ? 'చూడండి'
                  : 'Watch Live'
                : isUpcoming
                ? isTe
                  ? 'వివరాలు'
                  : 'Details'
                : isTe
                ? 'రీప్లే'
                : 'Watch Replay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
