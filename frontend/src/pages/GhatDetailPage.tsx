import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Waves,
  MapPin,
  ArrowLeft,
  Users,
  Accessibility,
  Shirt,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Ghat } from '../types/phase2';
import { phase2Api } from '../services/phase2Api';
import { useLanguage } from '../hooks/useLanguage';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { DemoBadge } from '../components/common/DemoBadge';
import { NavigateButton } from '../components/common/NavigateButton';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { useGeolocation } from '../hooks/useGeolocation';

export const GhatDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isTe } = useLanguage();
  const { location: userCoords, calculateDistance } = useGeolocation();

  const [ghat, setGhat] = useState<Ghat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      setError(false);
      try {
        const detail = await phase2Api.getGhatById(id);
        if (detail) {
          setGhat(detail);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <LoadingState />
      </div>
    );
  }

  if (error || !ghat) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <ErrorState
          messageTe="ఘాట్ వివరాలు కనుగొనబడలేదు."
          messageEn="Ghat not found or failed to load."
          onRetry={() => navigate('/explore')}
        />
      </div>
    );
  }

  const dist = calculateDistance(ghat.coordinates);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-godavari-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTe ? 'అన్ని ఘాట్‌లు' : 'All Bathing Ghats'}</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-md aspect-[21/9] sm:aspect-[2.4/1] bg-slate-900">
          <img
            src={ghat.imageUrl}
            alt={isTe ? ghat.nameTe : ghat.nameEn}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {ghat.status === 'open'
                ? isTe
                  ? 'ప్రస్తుతం తెరిచి ఉంది'
                  : 'Open'
                : isTe
                ? 'పరిమితం'
                : 'Restricted'}
            </span>
            {ghat.isDemo && <DemoBadge />}
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold drop-shadow-md">
              {isTe ? ghat.nameTe : ghat.nameEn}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-godavari-gold-400" />
                <span>{isTe ? ghat.addressTe : ghat.addressEn}</span>
              </span>
              {dist !== undefined && (
                <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-medium">
                  📍 {dist} km away
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                {isTe ? 'ఘాట్ విశేషాలు & భద్రత' : 'About This Bathing Ghat'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isTe ? ghat.descTe : ghat.descEn}
              </p>

              {/* Safe Depth Info Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm">
                    {isTe ? 'నీటి లోతు & భద్రతా మార్గదర్శకం' : 'Water Safety & Depth'}
                  </h4>
                  <p className="text-xs text-blue-700 mt-0.5">{ghat.safeDepthInfo}</p>
                </div>
              </div>

              <div className="pt-2">
                <DemoBadge variant="banner" />
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {isTe ? 'ఘాట్ లొకేషన్ మ్యాప్' : 'Ghat Location Map'}
                  </h3>
                  <p className="text-xs text-slate-500">{ghat.nearbyLandmark}</p>
                </div>
                <NavigateButton
                  coordinates={ghat.coordinates}
                  userCoords={userCoords}
                  size="md"
                />
              </div>

              <InteractiveMap
                points={[
                  {
                    id: ghat.id,
                    type: 'ghat',
                    title: isTe ? ghat.nameTe : ghat.nameEn,
                    subtitle: isTe ? ghat.addressTe : ghat.addressEn,
                    coordinates: ghat.coordinates,
                    isDemo: ghat.isDemo,
                  },
                ]}
                center={ghat.coordinates}
                zoom={15}
                userCoords={userCoords}
                height="320px"
              />
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Action Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                {isTe ? 'ఈ ఘాట్‌కు చేరుకోండి' : 'Reach this Ghat'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isTe
                  ? 'గూగుల్ మ్యాప్స్ ద్వారా కాలినడక లేదా వాహన మార్గం పొందండి.'
                  : 'Open step-by-step navigation directly in Google Maps.'}
              </p>
              <NavigateButton
                coordinates={ghat.coordinates}
                userCoords={userCoords}
                className="w-full justify-center"
                size="lg"
              />
            </div>

            {/* Crowd & Live Status */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-godavari-blue-600" />
                <span>{isTe ? 'రద్దీ పరిస్థితి (డెమో)' : 'Crowd Status (Demo)'}</span>
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{isTe ? 'ప్రస్తుత సాంద్రత:' : 'Current density:'}</span>
                <span className="font-bold text-slate-800">{ghat.crowdPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    ghat.crowdStatus === 'low'
                      ? 'bg-emerald-500'
                      : ghat.crowdStatus === 'moderate'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${ghat.crowdPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 italic">
                {isTe
                  ? 'గమనిక: ఇది నమూనా సమాచారం మాత్రమే.'
                  : 'Note: Crowd metrics are simulated demo values.'}
              </p>
            </div>

            {/* Amenities on site */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Waves className="w-4 h-4 text-godavari-blue-600" />
                <span>{isTe ? 'అందుబాటులో ఉన్న సదుపాయాలు' : 'On-Site Amenities'}</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {ghat.isAccessible && (
                  <li className="flex items-center gap-2">
                    <Accessibility className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{isTe ? 'దివ్యాంగుల ర్యాంప్ సదుపాయం' : 'Wheelchair Ramp Available'}</span>
                  </li>
                )}
                {ghat.hasChangingRooms && (
                  <li className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>{isTe ? 'మహిళా/పురుష బట్టలు మార్చుకునే గదులు' : 'Changing Rooms Available'}</span>
                  </li>
                )}
                {ghat.hasMedicalCamp && (
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isTe ? 'ప్రథమ చికిత్స & వైద్య శిబిరం' : 'First Aid & Medical Station'}</span>
                  </li>
                )}
                {ghat.amenities.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
