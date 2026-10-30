import React, { useState, useEffect } from 'react';
import {
  Radio,
  Clock,
  AlertCircle,
  Share2,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { LiveStream } from '../../types/phase4';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoBadge } from '../common/DemoBadge';
import { ReminderButton } from './ReminderButton';

interface VideoPlayerProps {
  stream: LiveStream;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream }) => {
  const { isTe } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<string>('');

  const isLive = stream.status === 'LIVE';
  const isUpcoming = stream.status === 'UPCOMING';
  const isEnded = stream.status === 'ENDED';
  const isOffline = stream.status === 'OFFLINE' || stream.status === 'CANCELLED';

  // Countdown timer for upcoming events
  useEffect(() => {
    if (!isUpcoming) return;

    const target = new Date(stream.scheduledStart).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown(isTe ? 'ప్రసారం ప్రారంభమవుతోంది...' : 'Stream starting shortly...');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m`);
      } else {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isUpcoming, stream.scheduledStart, isTe]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isTe ? stream.titleTe : stream.titleEn,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = new Date(stream.scheduledStart).toLocaleDateString(
    isTe ? 'te-IN' : 'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <div className="space-y-6">
      {/* ─── Video Display Container ────────────────────────────────────────── */}
      <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800">
        {isLive || isEnded ? (
          /* Authorized YouTube Live / Replay Embed */
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${stream.videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0`}
            title={isTe ? stream.titleTe : stream.titleEn}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : isUpcoming ? (
          /* UPCOMING SCHEDULE STATE: Clear schedule notice, NOT pretending to be live */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-godavari-blue-950 via-slate-900 to-black overflow-hidden">
            <img
              src={stream.thumbnailUrl}
              alt="Backdrop"
              className="absolute inset-0 w-full h-full object-cover opacity-25 blur-sm"
            />
            <div className="relative z-10 max-w-lg space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black tracking-wider uppercase">
                <Clock className="w-3.5 h-3.5" />
                {isTe ? 'షెడ్యూల్ చేయబడిన ప్రసారం' : 'Scheduled Broadcast'}
              </span>

              <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                {isTe ? stream.titleTe : stream.titleEn}
              </h2>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2">
                <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider block">
                  {isTe ? 'ప్రసారానికి మిగిలిన సమయం:' : 'Live Stream Begins In:'}
                </span>
                <div className="text-2xl sm:text-4xl font-mono font-black text-white tracking-widest">
                  {countdown || 'Loading...'}
                </div>
                <div className="text-xs text-slate-300 flex items-center justify-center gap-1.5 pt-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <ReminderButton
                  streamId={stream.id}
                  streamTitleTe={stream.titleTe}
                  streamTitleEn={stream.titleEn}
                  scheduledStart={stream.scheduledStart}
                  size="md"
                />
              </div>
            </div>
          </div>
        ) : isOffline ? (
          /* OFFLINE STATE */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900 space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-500" />
            <h3 className="text-lg font-bold">
              {isTe ? 'ప్రస్తుతం ప్రసారం ఆఫ్‌లైన్‌లో ఉంది' : 'Feed Currently Offline'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              {isTe
                ? 'ఈ ఘాట్ నుండి ప్రత్యక్ష ఫీడ్ ప్రస్తుతం అందుబాటులో లేదు. దయచేసి తదుపరి సమయాల్లో తనిఖీ చేయండి.'
                : 'This stream is not actively transmitting. Explore other live ghats or archived replays.'}
            </p>
          </div>
        ) : (
          /* CANCELLED STATE */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900 space-y-3">
            <AlertCircle className="w-12 h-12 text-rose-500" />
            <h3 className="text-lg font-bold">
              {isTe ? 'ప్రసారం రద్దు చేయబడింది' : 'Broadcast Cancelled'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              {isTe
                ? 'వాతావరణం లేదా అధికారిక మార్పుల వలన ఈ కార్యక్రమం రద్దయింది.'
                : 'This event was cancelled by festival organizers.'}
            </p>
          </div>
        )}
      </div>

      {/* ─── Stream Details Box ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-xs animate-pulse">
                  <Radio className="w-3.5 h-3.5" />
                  <span>LIVE NOW</span>
                </span>
              ) : isUpcoming ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                  <Clock className="w-3.5 h-3.5" />
                  <span>UPCOMING</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-white text-xs font-bold">
                  RECORDED REPLAY
                </span>
              )}

              <span className="bg-godavari-blue-50 text-godavari-blue-800 border border-godavari-blue-200 text-xs font-bold px-3 py-0.5 rounded-full">
                {isTe ? stream.categoryLabelTe : stream.categoryLabelEn}
              </span>

              {stream.isDemo && <DemoBadge />}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isTe ? stream.titleTe : stream.titleEn}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{isTe ? stream.venueTe : stream.venueEn}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedDate}</span>
              </span>
              {isLive && stream.viewerCount && (
                <>
                  <span>•</span>
                  <span className="font-bold text-rose-600">
                    👁️ {stream.viewerCount} {isTe ? 'భక్తులు చూస్తున్నారు' : 'watching now'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {isUpcoming && (
              <ReminderButton
                streamId={stream.id}
                streamTitleTe={stream.titleTe}
                streamTitleEn={stream.titleEn}
                scheduledStart={stream.scheduledStart}
                size="md"
              />
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? (isTe ? 'కాపీ అయింది!' : 'Copied!') : isTe ? 'షేర్ చేయండి' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-base">
            {isTe ? 'కార్యక్రమ వివరాలు & ఆధ్యాత్మిక విశిష్టత' : 'About this Sacred Broadcast'}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isTe ? stream.descTe : stream.descEn}
          </p>
        </div>

        {/* Official broadcast notice */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">
              {isTe ? 'అధికారిక యూట్యూబ్ లైవ్ ప్రసార సమగ్రత' : 'Authorized Video Stream Policy'}
            </span>
            <span className="text-amber-800 leading-relaxed block">
              {isTe
                ? 'గోదావరి పుష్కరాలు 2027 అధికారిక ప్రసారాలు యూట్యూబ్ ఎంబెడ్ ద్వారా భక్తులకు నేరుగా అందించబడుతున్నాయి. కంటెంట్ కాపీరైట్స్ ధర్మకర్తలదే.'
                : 'All broadcasts use official YouTube embedded player compliance. Streaming video content is subject to official temple trust copyright permissions.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
