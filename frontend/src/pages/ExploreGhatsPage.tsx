import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Ghat, GhatStatus, CrowdStatus } from '../types/phase2';
import { phase2Api } from '../services/phase2Api';
import { GhatCard } from '../components/ghats/GhatCard';
import { GhatRecommendation } from '../components/ghats/GhatRecommendation';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { DemoBadge } from '../components/common/DemoBadge';
import { useGeolocation } from '../hooks/useGeolocation';
import { Waves, Search, Filter, MapPin, Accessibility, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExploreGhatsPage: React.FC = () => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();
  const {
    location: userLocation,
    loading: geoLoading,
    requestLocation,
    calculateDistance,
    error: geoError,
  } = useGeolocation();

  const [ghats, setGhats] = useState<Ghat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<GhatStatus | 'all'>('all');
  const [crowdFilter, setCrowdFilter] = useState<CrowdStatus | 'all'>('all');
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [nearbyOnly, setNearbyOnly] = useState(false);

  const loadGhats = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await phase2Api.getGhats();
      setGhats(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGhats();
  }, []);

  // Compute distances for ghats if userLocation is available
  const ghatsWithDistance = ghats.map((g) => ({
    ...g,
    distanceKm: calculateDistance(g.coordinates),
  }));

  // Filtering
  const filteredGhats = ghatsWithDistance.filter((g) => {
    const name = (isTe ? g.nameTe : g.nameEn).toLowerCase();
    const desc = (isTe ? g.descTe : g.descEn).toLowerCase();
    const landmark = g.nearbyLandmark.toLowerCase();
    const s = search.toLowerCase();

    if (search && !name.includes(s) && !desc.includes(s) && !landmark.includes(s)) {
      return false;
    }

    if (statusFilter !== 'all' && g.status !== statusFilter) {
      return false;
    }

    if (crowdFilter !== 'all' && g.crowdStatus !== crowdFilter) {
      return false;
    }

    if (accessibleOnly && !g.isAccessible) {
      return false;
    }

    if (nearbyOnly && (g.distanceKm === undefined || g.distanceKm > 5)) {
      return false;
    }

    return true;
  });

  // Sort: if nearbyOnly or distances are available, sort by distance; else by crowd
  if (userLocation) {
    filteredGhats.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-godavari-blue-50 text-godavari-blue-700 border border-godavari-blue-200 text-xs font-semibold">
            <Waves className="w-3.5 h-3.5" />
            <span>{isTe ? 'గోదావరి స్నాన ఘాట్‌లు' : 'Godavari Bathing Ghats'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isTe ? 'పవిత్ర స్నాన ఘాట్‌ల డైరెక్టరీ' : 'Bathing Ghats & Safety Directory'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isTe
              ? 'రాజమహేంద్రవరం పరిధిలోని అన్ని స్నాన ఘాట్‌ల వివరాలు, రద్దీ స్థాయిలు, నీటి భద్రత మరియు మార్గదర్శకాలు.'
              : 'Explore authorized bathing ghats across Rajahmundry with real-time crowd status, accessibility, and navigation.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <DemoBadge variant="banner" />
          </div>
        </div>

        {/* Location Detection & Interactive Map Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-godavari-blue-50 text-godavari-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                {userLocation
                  ? isTe
                    ? 'మీ లొకేషన్ గుర్తించబడింది ✓'
                    : 'Location Detected ✓'
                  : isTe
                  ? 'మీ ప్రస్తుత స్థానం గుర్తించండి'
                  : 'Detect Your Current Location'}
              </h3>
              <p className="text-xs text-slate-500">
                {userLocation
                  ? isTe
                    ? `సమీప ఘాట్‌లకు దూరం లెక్కించబడింది (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`
                    : `Distances calculated from (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`
                  : isTe
                  ? 'సమీపంలోని ఘాట్‌లను సులువుగా కనుగొనడానికి లొకేషన్ ఆన్ చేయండి'
                  : 'Find the closest bathing ghats to your position'}
              </p>
              {geoError && <p className="text-xs text-amber-600 mt-1">{geoError}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!userLocation ? (
              <button
                type="button"
                onClick={requestLocation}
                disabled={geoLoading}
                className="flex-1 sm:flex-initial px-4 py-2 bg-godavari-blue-600 hover:bg-godavari-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{geoLoading ? (isTe ? 'గుర్తిస్తోంది...' : 'Locating...') : isTe ? 'నా లొకేషన్ వాడండి' : 'Use My Location'}</span>
              </button>
            ) : (
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isTe ? 'యాక్టివ్' : 'Active'}
              </span>
            )}

            <button
              type="button"
              onClick={() => navigate('/explore/map')}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Waves className="w-3.5 h-3.5 text-godavari-blue-600" />
              <span>{isTe ? 'మ్యాప్‌లో చూడండి' : 'Open Map'}</span>
            </button>
          </div>
        </div>

        {/* Smart Recommendation Engine */}
        <GhatRecommendation
          ghats={ghatsWithDistance}
          userCoords={userLocation}
          accessibleOnly={accessibleOnly}
        />

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isTe
                  ? 'ఘాట్ పేరు, సమీప ప్రదేశం లేదా వివరాలతో వెతకండి...'
                  : 'Search ghat by name, nearby landmark or description...'
              }
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-godavari-blue-500/20 focus:border-godavari-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-semibold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              {isTe ? 'రద్దీ స్థాయి:' : 'Crowd:'}
            </span>
            {(['all', 'low', 'moderate', 'high'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setCrowdFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  crowdFilter === lvl
                    ? 'bg-godavari-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl === 'all'
                  ? isTe
                    ? 'అన్నీ'
                    : 'All'
                  : lvl === 'low'
                  ? isTe
                    ? 'తక్కువ రద్దీ'
                    : 'Low'
                  : lvl === 'moderate'
                  ? isTe
                    ? 'మధ్యస్థం'
                    : 'Moderate'
                  : isTe
                  ? 'అధిక రద్దీ'
                  : 'High'}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            <button
              type="button"
              onClick={() => setAccessibleOnly(!accessibleOnly)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                accessibleOnly
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Accessibility className="w-3.5 h-3.5" />
              <span>{isTe ? 'దివ్యాంగుల సౌకర్యం' : 'Accessible Only'}</span>
            </button>

            {userLocation && (
              <button
                type="button"
                onClick={() => setNearbyOnly(!nearbyOnly)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  nearbyOnly
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📍 {isTe ? 'సమీపంలోనివి (< 5 km)' : 'Nearby (< 5 km)'}
              </button>
            )}
          </div>
        </div>

        {/* Directory Cards */}
        {loading ? (
          <LoadingState
            messageTe="ఘాట్‌ల వివరాలు లోడ్ అవుతున్నాయి..."
            messageEn="Loading bathing ghats..."
          />
        ) : error ? (
          <ErrorState onRetry={loadGhats} />
        ) : filteredGhats.length === 0 ? (
          <EmptyState
            titleTe="ఎలాంటి ఘాట్‌లు కనుగొనబడలేదు"
            titleEn="No bathing ghats found"
            descTe="మీరు ఎంచుకున్న ఫిల్టర్‌లకు సరిపోలిన ఘాట్‌లు లేవు. ఫిల్టర్లను రీసెట్ చేయండి."
            descEn="No ghats match your criteria. Please reset your filters."
            actionTextTe="ఫిల్టర్లు రీసెట్ చేయండి"
            actionTextEn="Reset Filters"
            onAction={() => {
              setSearch('');
              setStatusFilter('all');
              setCrowdFilter('all');
              setAccessibleOnly(false);
              setNearbyOnly(false);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGhats.map((ghat) => (
              <GhatCard
                key={ghat.id}
                ghat={ghat}
                userCoords={userLocation}
                distanceKm={ghat.distanceKm}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
