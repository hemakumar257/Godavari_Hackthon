import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { phase2Api } from '../services/phase2Api';
import { InteractiveMap, MapPoint } from '../components/map/InteractiveMap';
import { useGeolocation } from '../hooks/useGeolocation';
import { DemoBadge } from '../components/common/DemoBadge';
import { Filter, Layers, Navigation } from 'lucide-react';

export const MapPage: React.FC = () => {
  const { isTe } = useLanguage();
  const {
    location: userLocation,
    loading: geoLoading,
    requestLocation,
    error: geoError,
  } = useGeolocation();

  const [points, setPoints] = useState<MapPoint[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ghat' | 'temple' | 'parking' | 'facility'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPoints = async () => {
      setLoading(true);
      try {
        const [ghats, temples, parkings, facilities] = await Promise.all([
          phase2Api.getGhats(),
          phase2Api.getTemples(),
          phase2Api.getParking(),
          phase2Api.getFacilities(),
        ]);

        const mapped: MapPoint[] = [
          ...ghats.map((g) => ({
            id: g.id,
            type: 'ghat' as const,
            title: isTe ? g.nameTe : g.nameEn,
            subtitle: isTe ? g.descTe : g.descEn,
            coordinates: g.coordinates,
            isDemo: g.isDemo,
          })),
          ...temples.map((t) => ({
            id: t.id,
            type: 'temple' as const,
            title: isTe ? t.nameTe : t.nameEn,
            subtitle: `${t.deity} • ${t.timings}`,
            coordinates: t.coordinates,
            isDemo: t.isDemo,
          })),
          ...parkings.map((p) => ({
            id: p.id,
            type: 'parking' as const,
            title: isTe ? p.nameTe : p.nameEn,
            subtitle: `${p.availableSlots}/${p.totalCapacity} slots free`,
            coordinates: p.coordinates,
            isDemo: p.isDemo,
          })),
          ...facilities.map((f) => ({
            id: f.id,
            type: 'facility' as const,
            title: isTe ? f.nameTe : f.nameEn,
            subtitle: isTe ? f.categoryLabelTe : f.categoryLabelEn,
            coordinates: f.coordinates,
            isDemo: f.isDemo,
          })),
        ];

        setPoints(mapped);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPoints();
  }, [isTe]);

  const filteredPoints =
    selectedCategory === 'all'
      ? points
      : points.filter((p) => p.type === selectedCategory);

  const categories = [
    { key: 'all', labelTe: 'అన్ని గుర్తులు', labelEn: 'All Points', color: 'bg-slate-800' },
    { key: 'ghat', labelTe: 'స్నాన ఘాట్‌లు', labelEn: 'Bathing Ghats', color: 'bg-sky-600' },
    { key: 'temple', labelTe: 'ఆలయాలు', labelEn: 'Temples', color: 'bg-amber-500' },
    { key: 'parking', labelTe: 'పార్కింగ్', labelEn: 'Parking', color: 'bg-indigo-600' },
    { key: 'facility', labelTe: 'సౌకర్యాలు', labelEn: 'Facilities', color: 'bg-emerald-600' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-godavari-blue-50 text-godavari-blue-700 border border-godavari-blue-200 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>{isTe ? 'ఇంటరాక్టివ్ మ్యాప్ నావిగేషన్' : 'Interactive Map Navigation'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isTe ? 'రాజమహేంద్రవరం పుష్కర మ్యాప్' : 'Rajamahendravaram Pushkaralu Map'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isTe
                ? 'ఘాట్‌లు, దేవాలయాలు, పార్కింగ్ మరియు ముఖ్య సేవా కేంద్రాల సమగ్ర డిజిటల్ పటం.'
                : 'Explore all bathing ghats, holy temples, parking spaces and amenities on OpenStreetMap.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DemoBadge />
            <button
              type="button"
              onClick={requestLocation}
              disabled={geoLoading}
              className="px-4 py-2 bg-godavari-blue-600 hover:bg-godavari-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>
                {geoLoading
                  ? isTe
                    ? 'గుర్తిస్తోంది...'
                    : 'Locating...'
                  : userLocation
                  ? isTe
                    ? 'లొకేషన్ నవీకరించండి'
                    : 'Update Location'
                  : isTe
                  ? 'నా స్థానం చూపించు'
                  : 'Show My Location'}
              </span>
            </button>
          </div>
        </div>

        {geoError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl">
            {geoError}
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 ml-1 mr-2">
            <Filter className="w-3.5 h-3.5" />
            {isTe ? 'ఫిల్టర్:' : 'Filter:'}
          </span>
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory === c.key
                  ? `${c.color} text-white shadow-sm`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${c.color}`} />
              <span>{isTe ? c.labelTe : c.labelEn}</span>
              <span className="text-[10px] opacity-75">
                (
                {c.key === 'all'
                  ? points.length
                  : points.filter((p) => p.type === c.key).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Map Container */}
        {loading ? (
          <div className="h-[550px] bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400">
            {isTe ? 'మ్యాప్ సమాచారం లోడ్ అవుతోంది...' : 'Loading map markers...'}
          </div>
        ) : (
          <div className="relative">
            <InteractiveMap
              points={filteredPoints}
              userCoords={userLocation}
              height="600px"
              center={userLocation || { lat: 16.9862, lng: 81.7845 }}
              zoom={14}
            />

            {/* Floating legend overlay on desktop */}
            <div className="hidden sm:block absolute bottom-6 left-6 z-[400] bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-lg text-xs space-y-1.5">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                {isTe ? 'మ్యాప్ సూచిక' : 'Map Legend'}
              </span>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-600" />
                <span className="text-slate-600">{isTe ? 'స్నాన ఘాట్' : 'Bathing Ghat'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-600">{isTe ? 'ఆలయం' : 'Temple'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                <span className="text-slate-600">{isTe ? 'పార్కింగ్' : 'Parking Hub'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="text-slate-600">{isTe ? 'ప్రాథమిక సౌకర్యం' : 'Facility'}</span>
              </div>
              {userLocation && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-semibold text-slate-700">
                    {isTe ? 'మీ స్థానం' : 'Your Location'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
