import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Temple } from '../types/phase2';
import { phase2Api } from '../services/phase2Api';
import { TempleCard } from '../components/temples/TempleCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { DemoBadge } from '../components/common/DemoBadge';
import { useGeolocation } from '../hooks/useGeolocation';
import { Sparkles, Search } from 'lucide-react';

export const TemplesPage: React.FC = () => {
  const { isTe } = useLanguage();
  const { location: userLocation, calculateDistance } = useGeolocation();

  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');

  const loadTemples = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await phase2Api.getTemples();
      setTemples(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemples();
  }, []);

  const filteredTemples = temples.filter((t) => {
    const name = (isTe ? t.nameTe : t.nameEn).toLowerCase();
    const deity = t.deity.toLowerCase();
    const desc = (isTe ? t.descTe : t.descEn).toLowerCase();
    const s = search.toLowerCase();
    return !search || name.includes(s) || deity.includes(s) || desc.includes(s);
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isTe ? 'గోదావరి ప్రాంత ఆలయాలు' : 'Godavari Temple Directory'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isTe ? 'రాజమహేంద్రవరం పుణ్యక్షేత్రాలు' : 'Sacred Temples & Shrines'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isTe
              ? 'పుష్కర స్నానం అనంతరం దర్శించవలసిన ప్రముఖ శివ, విష్ణు మరియు అమ్మవారి ఆలయాల వివరాలు.'
              : 'Discover prominent historical and religious temples in and around Rajamahendravaram.'}
          </p>
          <div className="pt-2">
            <DemoBadge variant="banner" />
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isTe
                  ? 'ఆలయం పేరు లేదా దైవంతో వెతకండి...'
                  : 'Search temples by name or deity...'
              }
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <LoadingState
            messageTe="ఆలయాల సమాచారం లోడ్ అవుతోంది..."
            messageEn="Loading temple directory..."
          />
        ) : error ? (
          <ErrorState onRetry={loadTemples} />
        ) : filteredTemples.length === 0 ? (
          <EmptyState
            titleTe="ఎలాంటి ఆలయాలు కనుగొనబడలేదు"
            titleEn="No temples found"
            onAction={() => setSearch('')}
            actionTextTe="వెతుకులాటను క్లియర్ చేయండి"
            actionTextEn="Clear Search"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemples.map((temple) => (
              <TempleCard
                key={temple.id}
                temple={temple}
                userCoords={userLocation}
                distanceKm={calculateDistance(temple.coordinates)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
