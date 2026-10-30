import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { Temple } from '../types/phase2';
import { phase2Api } from '../services/phase2Api';
import { useLanguage } from '../hooks/useLanguage';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { DemoBadge } from '../components/common/DemoBadge';
import { NavigateButton } from '../components/common/NavigateButton';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { useGeolocation } from '../hooks/useGeolocation';

export const TempleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isTe } = useLanguage();
  const { location: userCoords, calculateDistance } = useGeolocation();

  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      setError(false);
      try {
        const detail = await phase2Api.getTempleById(id);
        if (detail) {
          setTemple(detail);
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

  if (error || !temple) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <ErrorState
          messageTe="ఆలయ వివరాలు కనుగొనబడలేదు."
          messageEn="Temple details not found."
          onRetry={() => navigate('/temples')}
        />
      </div>
    );
  }

  const dist = calculateDistance(temple.coordinates);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <button
            type="button"
            onClick={() => navigate('/temples')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTe ? 'అన్ని ఆలయాలు' : 'All Temples'}</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-md aspect-[21/9] sm:aspect-[2.4/1] bg-slate-900">
          <img
            src={temple.imageUrl}
            alt={isTe ? temple.nameTe : temple.nameEn}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
            <span className="bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {temple.deity}
            </span>
            {temple.isDemo && <DemoBadge />}
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold drop-shadow-md">
              {isTe ? temple.nameTe : temple.nameEn}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{isTe ? temple.addressTe : temple.addressEn}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{temple.timings}</span>
              </span>
              {dist !== undefined && (
                <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-medium">
                  📍 {dist} km
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                {isTe ? 'ఆలయ విశిష్టత & చరిత్ర' : 'Historical & Religious Significance'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isTe ? temple.descTe : temple.descEn}
              </p>
              <div className="pt-2">
                <DemoBadge variant="banner" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {isTe ? 'ఆలయ స్థానం & మ్యాప్' : 'Temple Location Map'}
                  </h3>
                  <p className="text-xs text-slate-500">{isTe ? temple.addressTe : temple.addressEn}</p>
                </div>
                <NavigateButton
                  coordinates={temple.coordinates}
                  userCoords={userCoords}
                  size="md"
                />
              </div>

              <InteractiveMap
                points={[
                  {
                    id: temple.id,
                    type: 'temple',
                    title: isTe ? temple.nameTe : temple.nameEn,
                    subtitle: temple.deity,
                    coordinates: temple.coordinates,
                    isDemo: temple.isDemo,
                  },
                ]}
                center={temple.coordinates}
                zoom={15}
                userCoords={userCoords}
                height="320px"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                {isTe ? 'దర్శన మార్గం' : 'Navigate to Temple'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isTe
                  ? 'గూగుల్ మ్యాప్స్ ద్వారా మార్గదర్శకాలను తక్షణమే తెరవండి.'
                  : 'Get driving or walking directions via Google Maps.'}
              </p>
              <NavigateButton
                coordinates={temple.coordinates}
                userCoords={userCoords}
                className="w-full justify-center bg-amber-600 hover:bg-amber-700"
                size="lg"
              />
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{isTe ? 'దర్శన వేళలు' : 'Darshan Timings'}</span>
              </h3>
              <p className="text-xs font-semibold text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-200/70">
                {temple.timings}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
