/**
 * RecordingsPage – /live/recordings
 * Phase 4: Recorded streams and highlights from Godavari Pushkaralu 2027
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  Search,
  Filter,
  Clock,
  Calendar,
  ArrowLeft,
  PlayCircle,
  Radio,
} from 'lucide-react';
import { LiveStream, StreamCategory } from '../types/phase4';
import { phase4Api } from '../services/phase4Api';
import { useLanguage } from '../hooks/useLanguage';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { DemoBadge } from '../components/common/DemoBadge';
import { StreamCard } from '../components/live/StreamCard';

const CATEGORY_FILTERS: { value: StreamCategory | 'all'; labelEn: string; labelTe: string }[] = [
  { value: 'all', labelEn: 'All Recordings', labelTe: 'అన్ని రికార్డింగులు' },
  { value: 'aarti', labelEn: 'Aarti & Puja', labelTe: 'ఆరతి & పూజ' },
  { value: 'ghat', labelEn: 'Ghat Views', labelTe: 'ఘాట్ దృశ్యాలు' },
  { value: 'temple', labelEn: 'Temple Ceremonies', labelTe: 'మందిర కార్యక్రమాలు' },
  { value: 'puja', labelEn: 'Special Pujas', labelTe: 'విశేష పూజలు' },
  { value: 'cultural', labelEn: 'Cultural & Heritage', labelTe: 'సాంస్కృతిక వారసత్వం' },
];

export const RecordingsPage: React.FC = () => {
  const { isTe } = useLanguage();
  const [recordings, setRecordings] = useState<LiveStream[]>([]);
  const [filtered, setFiltered] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<StreamCategory | 'all'>('all');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await phase4Api.getRecordings();
        setRecordings(data);
        setFiltered(data);
      } catch {
        setError('Failed to load recordings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter whenever search/category changes
  useEffect(() => {
    let result = recordings;
    if (category !== 'all') {
      result = result.filter((r) => r.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.titleEn.toLowerCase().includes(q) ||
          r.titleTe.toLowerCase().includes(q) ||
          r.venueEn.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, category, recordings]);

  const featured = recordings.filter((r) => r.featured);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-godavari-blue-950 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-godavari-blue-950 via-godavari-blue-900 to-godavari-turquoise-900/40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-godavari-turquoise-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back link */}
          <Link
            to="/live"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isTe ? 'లైవ్ హబ్‌కు తిరిగి వెళ్ళు' : 'Back to Live Hub'}
          </Link>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-godavari-turquoise-700/30 border border-godavari-turquoise-600/30">
              <Video className="w-7 h-7 text-godavari-turquoise-300" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-telugu">
                  {isTe ? 'రికార్డింగులు & హైలైట్లు' : 'Recordings & Highlights'}
                </h1>
                <DemoBadge />
              </div>
              <p className="text-slate-300 font-telugu text-sm sm:text-base max-w-2xl">
                {isTe
                  ? 'గోదావరి పుష్కరాల 2027 పవిత్ర కార్యక్రమాల పూర్తి వీడియో రికార్డింగులు మరియు ప్రముఖ హైలైట్లు.'
                  : 'Full video recordings and highlight reels from the sacred ceremonies of Godavari Pushkaralu 2027.'}
              </p>
              <p className="mt-2 text-xs text-amber-400 font-semibold">
                ⚠️ {isTe ? 'ఇవి డెమో రికార్డింగులు — అధికారిక ప్రసారాలు కావు.' : 'These are demo recordings — not official broadcast archives.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Featured Recordings */}
        {!loading && !error && featured.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-godavari-blue-950 font-telugu mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-500" />
              {isTe ? 'ప్రముఖ రికార్డింగులు' : 'Featured Recordings'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((stream) => (
                <Link
                  key={stream.id}
                  to={`/live/${stream.id}`}
                  className="group relative rounded-2xl overflow-hidden bg-godavari-blue-950 shadow-elevated border border-godavari-blue-800 hover:border-godavari-turquoise-500 transition-all"
                >
                  <div className="aspect-video relative">
                    <img
                      src={stream.thumbnailUrl}
                      alt={stream.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <PlayCircle className="w-9 h-9 text-rose-600" />
                      </div>
                    </div>
                    {stream.duration && (
                      <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
                        {stream.duration}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-xs text-godavari-turquoise-300 font-semibold mb-1 font-telugu">
                      {isTe ? stream.categoryLabelTe : stream.categoryLabelEn}
                    </div>
                    <h3 className="text-white font-bold font-telugu text-base leading-snug">
                      {isTe ? stream.titleTe : stream.titleEn}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {stream.recordingDate ?? stream.scheduledStart.slice(0, 10)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {isTe ? stream.venueTe : stream.venueEn}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-4 sm:p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isTe ? 'రికార్డింగులు వెతకండి...' : 'Search recordings...'}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-godavari-turquoise-500 font-telugu"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StreamCategory | 'all')}
                className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-godavari-turquoise-500 bg-white font-telugu appearance-none cursor-pointer"
              >
                {CATEGORY_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {isTe ? f.labelTe : f.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setCategory(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors font-telugu ${
                  category === f.value
                    ? 'bg-godavari-blue-950 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isTe ? f.labelTe : f.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-sm text-slate-500 mb-5 font-telugu">
            {isTe
              ? `${filtered.length} రికార్డింగులు కనుగొనబడ్డాయి`
              : `${filtered.length} recording${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        )}

        {/* Content */}
        {loading && (
          <LoadingState
            messageTe="రికార్డింగులు లోడ్ అవుతున్నాయి..."
            messageEn="Loading recordings..."
          />
        )}
        {error && !loading && (
          <ErrorState
            messageTe="రికార్డింగులు లోడ్ చేయడంలో లోపం."
            messageEn={error}
            onRetry={() => window.location.reload()}
          />
        )}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            titleTe="రికార్డింగులు లేవు"
            titleEn="No Recordings Found"
            descTe="మీ శోధనకు సరిపోయే రికార్డింగులు కనుగొనబడలేదు."
            descEn="No recordings match your current search or filter."
            actionTextTe="అన్నీ చూపించు"
            actionTextEn="Show All"
            onAction={() => { setSearch(''); setCategory('all'); }}
          />
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
