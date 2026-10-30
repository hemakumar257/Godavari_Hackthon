import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Radio, Users, MapPin, ArrowRight, Video, Calendar } from 'lucide-react';
import { phase4Api } from '../../services/phase4Api';
import { LiveStream } from '../../types/phase4';
import { useLanguage } from '../../hooks/useLanguage';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';

export const LivePushkaraluPreview: React.FC = () => {
  const { isTe } = useLanguage();
  const [streams, setStreams] = useState<LiveStream[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await phase4Api.getLiveStreams();
        setStreams(data.slice(0, 3));
      } catch {
        // Fallback handled gracefully
      }
    };
    load();
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-slate-100/70 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          titleTe="లైవ్ పుష్కరాలు (Live Broadcasts)"
          titleEn="Live Pushkaralu & Sacred Ceremonies"
          subtitleTe="మహా హారతి, పవిత్ర ఘాట్లు మరియు ఆలయ పూజా కార్యక్రమాల ప్రత్యక్ష ప్రసారాలు (డెమో ప్రివ్యూ)"
          subtitleEn="Live streaming coverage of Godavari Aarti, sacred river ghats and ceremonies (Demonstration Preview)"
          actionText={isTe ? 'లైవ్ హబ్‌కు వెళ్ళండి' : 'Go to Live Hub'}
          actionHref="/live"
          isTe={isTe}
        />

        {/* Feature Banner */}
        <div className="bg-godavari-blue-950 text-white rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-elevated border border-godavari-blue-900">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-godavari-turquoise-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wider uppercase text-rose-300">
                  {isTe ? 'ప్రత్యక్ష ప్రసార వేదిక' : 'Live Streaming Suite'}
                </span>
                <span className="text-slate-400">•</span>
                <Badge variant="demo" size="sm">
                  {isTe ? 'డెమో స్ట్రీమ్ మోడ్' : 'Demo Stream Mode'}
                </Badge>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-telugu text-white mb-2">
                {isTe
                  ? 'గోదావరి సంధ్యా మహా హారతి మరియు పవిత్ర ఘాట్ లైవ్ దర్శనం'
                  : 'Godavari Sandhya Maha Harati & Sacred Ghat Stream'}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed font-telugu">
                {isTe
                  ? 'ప్రపంచవ్యాప్తంగా ఉన్న భక్తులు రాజమహేంద్రవరం పవిత్ర ఘాట్లు, సంధ్యా హారతి మరియు పూజా విశేషాలను ప్రత్యక్షంగా వీక్షించవచ్చు.'
                  : 'Pilgrims across the globe can virtually witness Godavari Aarti, riverfront darshan, and authorized temple pujas via secure YouTube Live integration.'}
              </p>
            </div>

            <Link
              to="/live"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-md transition-all self-start md:self-auto shrink-0 font-telugu"
            >
              <Video className="w-4 h-4" />
              <span>{isTe ? 'లైవ్ హబ్ తెరవండి' : 'Open Live Hub'}</span>
            </Link>
          </div>
        </div>

        {/* Stream Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <div
              key={stream.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={stream.thumbnailUrl}
                  alt={stream.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {stream.status === 'LIVE' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-bold tracking-wide">
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      LIVE (DEMO)
                    </span>
                  ) : stream.status === 'UPCOMING' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 text-white text-xs font-semibold">
                      UPCOMING
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-700 text-slate-200 text-xs font-medium">
                      RECORDING
                    </span>
                  )}
                </div>

                {/* Center Play Indicator */}
                <Link
                  to={`/live/${stream.id}`}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]"
                >
                  <div className="w-12 h-12 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <PlayCircle className="w-7 h-7" />
                  </div>
                </Link>

                {/* Bottom Overlay text */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                  <span className="flex items-center gap-1 text-[11px] font-telugu truncate max-w-[65%]">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    {isTe ? stream.venueTe : stream.venueEn}
                  </span>
                  {stream.viewerCount ? (
                    <span className="flex items-center gap-1 text-[11px] text-slate-300 shrink-0">
                      <Users className="w-3 h-3" />
                      {stream.viewerCount}
                    </span>
                  ) : stream.duration ? (
                    <span className="text-[11px] font-mono text-slate-300 shrink-0">
                      {stream.duration}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-amber-300 shrink-0">
                      <Calendar className="w-3 h-3" />
                      {stream.scheduledStart.slice(11, 16)} UTC
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-godavari-turquoise-700 mb-1 font-telugu">
                    {isTe ? stream.categoryLabelTe : stream.categoryLabelEn}
                  </div>
                  <h4 className="font-bold text-godavari-blue-950 font-telugu text-base leading-snug group-hover:text-godavari-blue-700 transition line-clamp-2">
                    {isTe ? stream.titleTe : stream.titleEn}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-telugu">
                  <span className="text-slate-500">
                    {isTe ? 'అధికారిక ఫీడ్ (డెమో)' : 'Authorized Feed (Demo)'}
                  </span>
                  <Link
                    to={`/live/${stream.id}`}
                    className="font-semibold text-godavari-blue-700 hover:text-godavari-turquoise-600 flex items-center gap-1"
                  >
                    {isTe ? 'వీక్షించండి' : 'Watch Stream'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
