/**
 * HeritageDetailPage – /heritage/:slug
 * Phase 5: Complete detail page for historical and spiritual locations
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Landmark,
  MapPin,
  Clock,
  ArrowLeft,
  Sparkles,
  Info,
  Share2,
  Check,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { HeritageLocation } from '../types/phase5';
import { phase5Api } from '../services/phase5Api';
import { useLanguage } from '../hooks/useLanguage';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { DemoBadge } from '../components/common/DemoBadge';
import { NavigateButton } from '../components/common/NavigateButton';
import { InteractiveMap } from '../components/map/InteractiveMap';

export const HeritageDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isTe } = useLanguage();

  const [location, setLocation] = useState<HeritageLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(false);
        const data = await phase5Api.getHeritageBySlug(slug);
        if (data) {
          setLocation(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToYatra = () => {
    if (location) {
      navigate('/yatra-planner/create', { state: { preselectLocation: location } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <LoadingState
          messageTe="చారిత్రక క్షేత్ర వివరాలు లోడ్ అవుతున్నాయి..."
          messageEn="Loading heritage destination details..."
        />
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <ErrorState
          messageTe="చారిత్రక క్షేత్రం కనుగొనబడలేదు."
          messageEn="Heritage destination not found or failed to load."
          onRetry={() => navigate('/heritage')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/heritage"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-godavari-blue-600 transition-colors font-telugu"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTe ? 'అన్ని చారిత్రక క్షేత్రాలు' : 'All Heritage Destinations'}</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors font-telugu"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? (isTe ? 'కాపీ చేయబడింది' : 'Link Copied') : isTe ? 'షేర్ చేయండి' : 'Share'}</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden shadow-md aspect-[21/9] sm:aspect-[2.4/1] bg-slate-900">
          <img
            src={location.imageUrl}
            alt={isTe ? location.nameTe : location.nameEn}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30" />

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-godavari-blue-900 text-godavari-turquoise-200 border border-godavari-turquoise-500/40">
              {isTe ? location.categoryLabelTe : location.categoryLabelEn}
            </span>
            <DemoBadge />
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold drop-shadow-md font-telugu">
              {isTe ? location.nameTe : location.nameEn}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1.5 font-telugu">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isTe ? location.addressTe : location.addressEn}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Full Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-godavari-blue-950 font-telugu flex items-center gap-2">
                <Landmark className="w-5 h-5 text-godavari-blue-700" />
                <span>{isTe ? 'చారిత్రక పరిచయం' : 'Historical Overview'}</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-telugu">
                {isTe ? location.fullDescTe : location.fullDescEn}
              </p>
            </div>

            {/* Significance Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-2">
                <h3 className="font-bold text-sm text-godavari-blue-900 font-telugu flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{isTe ? 'ఆధ్యాత్మిక విశిష్టత' : 'Spiritual Significance'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-telugu">
                  {isTe ? location.spiritualSignificanceTe : location.spiritualSignificanceEn}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-2">
                <h3 className="font-bold text-sm text-godavari-blue-900 font-telugu flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-godavari-turquoise-600" />
                  <span>{isTe ? 'చారిత్రక ప్రాముఖ్యత' : 'Historical Importance'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-telugu">
                  {isTe ? location.historicalSignificanceTe : location.historicalSignificanceEn}
                </p>
              </div>
            </div>

            {/* Legends & Stories */}
            {location.storiesAndLegendsEn.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/50 rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-3">
                <h3 className="font-bold text-amber-950 text-base font-telugu flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{isTe ? 'స్థల పురాణం & విశేష కథనాలు' : 'Legends & Sthalapurana'}</span>
                </h3>
                <ul className="space-y-2">
                  {(isTe ? location.storiesAndLegendsTe : location.storiesAndLegendsEn).map((story, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-telugu leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span>{story}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Photo Gallery Grid */}
            {location.gallery.length > 1 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="font-bold text-godavari-blue-950 text-base font-telugu">
                  {isTe ? 'చిత్రమాలిక' : 'Photo Gallery'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {location.gallery.map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-[4/3] bg-slate-900">
                      <img
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Preview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-godavari-blue-950 text-base font-telugu">
                    {isTe ? 'క్షేత్ర స్థానం & దారి' : 'Location & Directions'}
                  </h3>
                  <p className="text-xs text-slate-500 font-telugu">
                    {isTe ? location.addressTe : location.addressEn}
                  </p>
                </div>
                <NavigateButton coordinates={location.coordinates} size="sm" />
              </div>

              <div className="h-64 rounded-xl overflow-hidden border border-slate-200">
                <InteractiveMap
                  center={location.coordinates}
                  zoom={15}
                  height="100%"
                  points={[
                    {
                      id: location.id,
                      type: 'facility',
                      title: isTe ? location.nameTe : location.nameEn,
                      subtitle: isTe ? location.addressTe : location.addressEn,
                      coordinates: location.coordinates,
                      isDemo: true,
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-godavari-blue-950 text-white rounded-3xl p-6 shadow-md border border-godavari-blue-900 space-y-4">
              <h3 className="font-bold text-lg font-telugu text-white">
                {isTe ? 'తీర్థ యాత్ర ప్రణాళిక' : 'Pilgrimage Action'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-telugu">
                {isTe
                  ? 'ఈ చారిత్రక క్షేత్రాన్ని మీ వ్యక్తిగత యాత్రా ప్రణాళికలో చేర్చుకోండి.'
                  : 'Add this destination to your customized Pushkaralu itinerary schedule.'}
              </p>

              <button
                type="button"
                onClick={handleAddToYatra}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 font-telugu"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>{isTe ? 'నా యాత్రకు చేర్చు' : 'Add to My Yatra'}</span>
              </button>

              <div className="pt-2">
                <NavigateButton
                  coordinates={location.coordinates}
                  className="w-full justify-center"
                />
              </div>
            </div>

            {/* Visiting Information Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-godavari-blue-950 text-base font-telugu flex items-center gap-2">
                <Clock className="w-4 h-4 text-godavari-blue-700" />
                <span>{isTe ? 'సందర్శన సమాచారం' : 'Visiting Information'}</span>
              </h3>

              <div className="space-y-3 text-xs divide-y divide-slate-100 font-telugu">
                <div className="pt-2 first:pt-0">
                  <div className="text-slate-400 font-semibold mb-0.5">
                    {isTe ? 'సందర్శనకు అనువైన సమయం:' : 'Best Time to Visit:'}
                  </div>
                  <div className="text-slate-800 font-medium">
                    {isTe ? location.visitingInfo.bestTimeToVisitTe : location.visitingInfo.bestTimeToVisitEn}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-slate-400 font-semibold mb-0.5">
                    {isTe ? 'సమయాలు:' : 'Timings:'}
                  </div>
                  <div className="text-slate-800 font-medium">
                    {isTe ? location.visitingInfo.timingsTe : location.visitingInfo.timingsEn}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-slate-400 font-semibold mb-0.5">
                    {isTe ? 'ప్రవేశ రుసుము:' : 'Entry Fee:'}
                  </div>
                  <div className="text-slate-800 font-medium">
                    {isTe ? location.visitingInfo.entryFeeTe : location.visitingInfo.entryFeeEn}
                  </div>
                </div>

                {location.visitingInfo.dressCodeEn && (
                  <div className="pt-2">
                    <div className="text-slate-400 font-semibold mb-0.5">
                      {isTe ? 'దుస్తుల నియమావళి:' : 'Dress Code:'}
                    </div>
                    <div className="text-slate-800 font-medium">
                      {isTe ? location.visitingInfo.dressCodeTe : location.visitingInfo.dressCodeEn}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nearby Ghats */}
            {location.nearbyGhats && location.nearbyGhats.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
                <h4 className="font-bold text-xs text-godavari-blue-950 uppercase tracking-wider font-telugu">
                  {isTe ? 'సమీప పవిత్ర ఘాట్లు' : 'Nearby Bathing Ghats'}
                </h4>
                <div className="space-y-2">
                  {location.nearbyGhats.map((ghat) => (
                    <Link
                      key={ghat.id}
                      to={`/explore/${ghat.id}`}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-godavari-blue-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-godavari-blue-900 font-telugu"
                    >
                      <span>{isTe ? ghat.nameTe : ghat.nameEn}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
