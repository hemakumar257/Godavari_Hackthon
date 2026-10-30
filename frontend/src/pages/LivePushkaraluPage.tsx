import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { LiveStream, StreamCategory, StreamStatus } from '../types/phase4';
import { phase4Api } from '../services/phase4Api';
import { StreamCard } from '../components/live/StreamCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { DemoBadge } from '../components/common/DemoBadge';
import {
  Tv,
  Radio,
  Search,
  Waves,
  Sparkles,
  Flame,
  Building2,
  Music,
  ArrowRight,
  Clock,
  Film,
  Video,
} from 'lucide-react';

export const LivePushkaraluPage: React.FC = () => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<StreamCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StreamStatus | 'all'>('all');

  const loadStreams = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await phase4Api.getLiveStreams();
      setStreams(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStreams();
  }, []);

  const categories: { key: StreamCategory | 'all'; labelTe: string; labelEn: string; icon: React.ReactNode }[] = [
    { key: 'all', labelTe: 'అన్ని ప్రసారాలు', labelEn: 'All Streams', icon: <Tv className="w-4 h-4" /> },
    { key: 'aarti', labelTe: 'గోదావరి హారతి', labelEn: 'Godavari Aarti', icon: <Flame className="w-4 h-4" /> },
    { key: 'ghat', labelTe: 'లైవ్ ఘాట్‌లు', labelEn: 'Live Ghats', icon: <Waves className="w-4 h-4" /> },
    { key: 'temple', labelTe: 'ఆలయ దర్శనం', labelEn: 'Temple Live', icon: <Building2 className="w-4 h-4" /> },
    { key: 'puja', labelTe: 'విశేష పూజలు', labelEn: 'Sacred Pujas', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'cultural', labelTe: 'సాంస్కృతిక వేడుకలు', labelEn: 'Cultural Shows', icon: <Music className="w-4 h-4" /> },
  ];

  // Currently live streams
  const activeLiveStreams = streams.filter((s) => s.status === 'LIVE');
  const upcomingStreams = streams.filter((s) => s.status === 'UPCOMING');

  // Filtered streams for main grid
  const filteredStreams = streams.filter((s) => {
    const title = (isTe ? s.titleTe : s.titleEn).toLowerCase();
    const venue = (isTe ? s.venueTe : s.venueEn).toLowerCase();
    const query = search.toLowerCase();

    if (search && !title.includes(query) && !venue.includes(query)) return false;
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ─── Hero Section ─────────────────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-godavari-blue-950 text-white border border-godavari-blue-900 p-6 sm:p-10 lg:p-12">
          {/* Background image & gradient overlay */}
          <img
            src="/images/godavari/4f354c28382287.55bde5d06e1d4.webp"
            alt="Godavari Live Aarti"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-godavari-blue-950 via-godavari-blue-950/80 to-transparent" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-xs">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>{activeLiveStreams.length} {isTe ? 'ప్రసారాలు లైవ్‌లో ఉన్నాయి' : 'Live Feeds Active'}</span>
              </span>
              <DemoBadge />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {isTe ? 'ప్రత్యక్ష పుష్కరాలు – డిజిటల్ దర్శనం' : 'Live Pushkaralu 2027 Video Suite'}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {isTe
                ? 'గోదావరి సంధ్యా మహా హారతి, ప్రముఖ ఘాట్‌ల ప్రత్యక్ష దృశ్యాలు మరియు వేద క్రతువులను ప్రపంచవ్యాప్తంగా ఎక్కడి నుంచైనా ప్రత్యక్షంగా వీక్షించండి.'
                : 'Experience the divine atmosphere of River Godavari from anywhere. Authorized live broadcasts of Pushkar Ghat Aarti, sacred bathing snanams, and temple pujas.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {activeLiveStreams.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate(`/live/${activeLiveStreams[0].id}`)}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>{isTe ? 'ఇప్పుడే లైవ్ చూడండి' : 'Watch Live Now'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate('/live/recordings')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-xs transition-colors flex items-center gap-2"
              >
                <Film className="w-4 h-4" />
                <span>{isTe ? 'గత రికార్డింగ్‌లు' : 'Explore Recordings'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Currently Live Section (Spotlight) ────────────────────────────── */}
        {activeLiveStreams.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isTe ? 'ప్రస్తుతం ప్రత్యక్ష ప్రసారం (Live Now)' : 'Currently Broadcasting Live'}
                </h2>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                {activeLiveStreams.length} {isTe ? 'యాక్టివ్ ఛానల్స్' : 'Active Streams'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeLiveStreams.map((stream) => (
                <StreamCard key={stream.id} stream={stream} variant="featured" />
              ))}
            </div>
          </div>
        )}

        {/* ─── Search & Category Filter Bar ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  isTe
                    ? 'హారతి, ఘాట్ పేరు లేదా కార్యక్రమంతో వెతకండి...'
                    : 'Search live streams by title, ghat, or ceremony...'
                }
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-slate-50/50"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(['all', 'LIVE', 'UPCOMING', 'ENDED'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    statusFilter === st
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all'
                    ? isTe
                      ? 'అన్నీ'
                      : 'All'
                    : st === 'LIVE'
                    ? isTe
                      ? 'లైవ్'
                      : 'Live'
                    : st === 'UPCOMING'
                    ? isTe
                      ? 'రాబోయేవి'
                      : 'Upcoming'
                    : isTe
                    ? 'పూర్తయినవి'
                    : 'Recorded'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategoryFilter(c.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  categoryFilter === c.key
                    ? 'bg-godavari-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.icon}
                <span>{isTe ? c.labelTe : c.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Stream Grid Content ─────────────────────────────────────────── */}
        {loading ? (
          <LoadingState
            messageTe="ప్రత్యక్ష ప్రసార సమాచారం లోడ్ అవుతోంది..."
            messageEn="Loading live stream feeds..."
          />
        ) : error ? (
          <ErrorState onRetry={loadStreams} />
        ) : filteredStreams.length === 0 ? (
          <EmptyState
            titleTe="ప్రస్తుతం ఎలాంటి ప్రసారాలు లేవు"
            titleEn="No live streams at the moment"
            descTe="మీరు ఎంచుకున్న ఫిల్టర్లకు సరిపోలిన ప్రసారాలు లేవు. రాబోయే కార్యక్రమాలు లేదా రికార్డింగ్‌లను అన్వేషించండి."
            descEn="No live streams match your selected filters. Explore upcoming programs or recorded highlights below."
            actionTextTe="అన్ని ప్రసారాలు చూపించు"
            actionTextEn="Show All Streams"
            onAction={() => {
              setSearch('');
              setCategoryFilter('all');
              setStatusFilter('all');
            }}
          />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStreams.map((stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          </div>
        )}

        {/* ─── Upcoming Programs Spotlight ─────────────────────────────────── */}
        {upcomingStreams.length > 0 && statusFilter !== 'LIVE' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>{isTe ? 'రాబోయే ప్రత్యక్ష కార్యక్రమాలు' : 'Upcoming Scheduled Broadcasts'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isTe
                    ? 'సమయానికి ప్రత్యక్ష ప్రసారం చూడటానికి జ్ఞాపిక (Reminder) సెట్ చేసుకోండి.'
                    : 'Never miss an auspicious muhurta or ceremonial broadcast. Set reminders in advance.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingStreams.map((stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          </div>
        )}

        {/* ─── Recordings Banner ───────────────────────────────────────────── */}
        <div className="rounded-3xl bg-gradient-to-r from-godavari-blue-900 to-godavari-turquoise-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-godavari-turquoise-300 uppercase tracking-wider">
              {isTe ? 'వీడియో ఆర్కైవ్స్' : 'Video Archives & Highlight Reels'}
            </span>
            <h3 className="text-2xl font-black text-white">
              {isTe
                ? 'గత పుష్కరాల హారతులు & పవిత్ర వేడుకల రికార్డింగ్‌లు'
                : 'Recorded Ceremonies, Archival Aartis & Highlights'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              {isTe
                ? 'మిస్సయిన కార్యక్రమాలు, విశేష నృత్య ప్రదర్శనలు మరియు వేద సభలను పూర్తి నాణ్యతతో చూడండి.'
                : 'Revisit completed rituals, devotional concerts, and aerial river showcases in high definition.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/live/recordings')}
            className="px-6 py-3 rounded-xl bg-white text-godavari-blue-950 font-bold text-sm shadow-md hover:bg-slate-100 transition-colors flex items-center gap-2 shrink-0"
          >
            <span>{isTe ? 'అన్ని రికార్డింగ్‌లు చూడండి' : 'View All Recordings'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
