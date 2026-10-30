/**
 * YatraDetailPage – /yatra-planner/:id
 * Phase 5: Complete Itinerary View, Maps, Summary & Google Maps Navigation
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Navigation,
  Check,
} from 'lucide-react';
import { YatraItinerary } from '../types/phase5';
import { phase5Api } from '../services/phase5Api';
import { useLanguage } from '../hooks/useLanguage';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { DemoBadge } from '../components/common/DemoBadge';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { NavigateButton } from '../components/common/NavigateButton';

export const YatraDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isTe } = useLanguage();

  const [yatra, setYatra] = useState<YatraItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    const data = phase5Api.getYatraById(id);
    if (data) {
      setYatra(data);
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEntireRoute = () => {
    if (!yatra || yatra.stops.length === 0) return;
    const dest = yatra.stops[yatra.stops.length - 1].coordinates;
    const waypoints = yatra.stops
      .slice(0, -1)
      .map((s) => `${s.coordinates.lat},${s.coordinates.lng}`)
      .join('|');
    const url = `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}&waypoints=${waypoints}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <LoadingState
          messageTe="యాత్రా ప్రణాళిక లోడ్ అవుతోంది..."
          messageEn="Loading pilgrimage itinerary..."
        />
      </div>
    );
  }

  if (error || !yatra) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <ErrorState
          messageTe="యాత్రా ప్రణాళిక కనుగొనబడలేదు."
          messageEn="Itinerary not found."
          onRetry={() => navigate('/yatra-planner')}
        />
      </div>
    );
  }

  const ghatStops = yatra.stops.filter((s) => s.referenceType === 'ghat');
  const templeStops = yatra.stops.filter((s) => s.referenceType === 'temple');
  const heritageStops = yatra.stops.filter((s) => s.referenceType === 'heritage');

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Share Row */}
        <div className="flex items-center justify-between">
          <Link
            to="/yatra-planner"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-godavari-blue-600 transition font-telugu"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTe ? 'అన్ని యాత్రా ప్రణాళికలు' : 'All Itineraries'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs font-telugu"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? (isTe ? 'కాపీ చేయబడింది' : 'Copied') : isTe ? 'షేర్ చేయండి' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-godavari-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-elevated border border-godavari-blue-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-godavari-turquoise-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 font-telugu">
                {yatra.isTemplate ? (isTe ? 'సూచించిన యాత్రా నమూనా' : 'Curated Template') : isTe ? 'వ్యక్తిగత యాత్ర' : 'Custom Yatra'}
              </span>
              <DemoBadge />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-telugu text-white leading-tight">
              {yatra.title}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-telugu">
              {yatra.description}
            </p>

            {/* Quick Stat Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-200 font-telugu">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{yatra.startDate}</span>
              </span>

              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <MapPin className="w-4 h-4 text-godavari-turquoise-400" />
                <span>{isTe ? 'ప్రారంభం:' : 'Start:'} {yatra.startingLocation}</span>
              </span>

              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{yatra.stops.length} {isTe ? 'ఆగడాలు' : 'Stops'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Itinerary Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-xs">
            <div className="text-2xl font-black text-godavari-blue-950 font-mono">
              {yatra.stops.length}
            </div>
            <div className="text-xs font-bold text-slate-500 font-telugu mt-0.5">
              {isTe ? 'మొత్తం స్థలాలు' : 'Total Stops'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-xs">
            <div className="text-2xl font-black text-godavari-turquoise-700 font-mono">
              {ghatStops.length}
            </div>
            <div className="text-xs font-bold text-slate-500 font-telugu mt-0.5">
              {isTe ? 'పవిత్ర ఘాట్లు' : 'Sacred Ghats'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-xs">
            <div className="text-2xl font-black text-amber-600 font-mono">
              {templeStops.length}
            </div>
            <div className="text-xs font-bold text-slate-500 font-telugu mt-0.5">
              {isTe ? 'ఆలయాలు' : 'Temples'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center shadow-xs">
            <div className="text-2xl font-black text-indigo-600 font-mono">
              {heritageStops.length}
            </div>
            <div className="text-xs font-bold text-slate-500 font-telugu mt-0.5">
              {isTe ? 'చారిత్రక క్షేత్రాలు' : 'Heritage Sites'}
            </div>
          </div>
        </div>

        {/* Content Layout: Stops Sequence vs Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Stops List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="font-bold text-lg text-godavari-blue-950 font-telugu flex items-center gap-2">
                <Compass className="w-5 h-5 text-godavari-blue-700" />
                <span>{isTe ? 'క్రమానుగత యాత్రా వివరాలు' : 'Ordered Itinerary Sequence'}</span>
              </h2>

              <button
                type="button"
                onClick={handleOpenEntireRoute}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-godavari-blue-50 text-godavari-blue-900 hover:bg-godavari-blue-100 font-bold text-xs transition font-telugu"
              >
                <Navigation className="w-3.5 h-3.5 text-godavari-blue-700" />
                <span>{isTe ? 'మొత్తం రూట్ గూగుల్ మ్యాప్స్‌లో' : 'Route in Google Maps'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {yatra.stops.map((stop, idx) => (
                <div
                  key={stop.stopId}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-godavari-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>

                    <img
                      src={stop.thumbnailUrl}
                      alt={isTe ? stop.nameTe : stop.nameEn}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                    />

                    <div className="min-w-0 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-godavari-turquoise-700 font-telugu">
                        {isTe ? stop.categoryLabelTe : stop.categoryLabelEn}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base truncate font-telugu">
                        {isTe ? stop.nameTe : stop.nameEn}
                      </h3>
                      <div className="text-xs text-slate-500 truncate">
                        {isTe ? stop.addressTe : stop.addressEn}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 font-telugu">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {stop.plannedArrivalTime || 'Flexible'}
                        </span>
                        <span>•</span>
                        <span>
                          {stop.estimatedDurationMinutes} {isTe ? 'నిమిషాల సమయం' : 'mins visit'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <NavigateButton
                    coordinates={stop.coordinates}
                    size="sm"
                    className="shrink-0 self-end sm:self-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Route Map (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-20">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-4">
              <h3 className="font-bold text-base text-godavari-blue-950 font-telugu flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>{isTe ? 'యాత్రా నక్షా (Itinerary Map)' : 'Itinerary Route Map'}</span>
              </h3>

              <div className="h-80 rounded-2xl overflow-hidden border border-slate-200">
                <InteractiveMap
                  center={
                    yatra.stops.length > 0
                      ? yatra.stops[0].coordinates
                      : { lat: 17.006, lng: 81.766 }
                  }
                  zoom={12}
                  height="100%"
                  points={yatra.stops.map((s, idx) => ({
                    id: s.stopId,
                    type: s.referenceType === 'ghat' ? 'ghat' : s.referenceType === 'temple' ? 'temple' : 'facility',
                    title: `${idx + 1}. ${isTe ? s.nameTe : s.nameEn}`,
                    subtitle: `${s.plannedArrivalTime || ''} (${s.estimatedDurationMinutes} mins)`,
                    coordinates: s.coordinates,
                    isDemo: true,
                  }))}
                />
              </div>

              <button
                type="button"
                onClick={handleOpenEntireRoute}
                className="w-full py-3 px-4 rounded-xl bg-godavari-blue-900 hover:bg-godavari-blue-950 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 font-telugu"
              >
                <Navigation className="w-4 h-4" />
                <span>{isTe ? 'పూర్తి మార్గాన్ని ప్రారంభించండి' : 'Start Full Route Navigation'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
