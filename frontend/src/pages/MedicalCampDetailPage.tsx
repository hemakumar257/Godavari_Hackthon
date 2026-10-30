import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Phone,
  Clock,
  MapPin,
  ArrowLeft,
  ShieldCheck,
  Ambulance,
  Calendar,
} from 'lucide-react';
import { MedicalCamp } from '../types/phase3';
import { phase3Api } from '../services/phase3Api';
import { useLanguage } from '../hooks/useLanguage';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { DemoBadge } from '../components/common/DemoBadge';
import { NavigateButton } from '../components/common/NavigateButton';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { useGeolocation } from '../hooks/useGeolocation';

export const MedicalCampDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isTe } = useLanguage();
  const { location: userCoords, calculateDistance } = useGeolocation();

  const [camp, setCamp] = useState<MedicalCamp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      setError(false);
      try {
        const detail = await phase3Api.getMedicalCampById(id);
        if (detail) {
          setCamp(detail);
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

  if (error || !camp) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <ErrorState
          messageTe="వైద్య శిబిర వివరాలు కనుగొనబడలేదు."
          messageEn="Medical camp details not found."
          onRetry={() => navigate('/medical-assistance')}
        />
      </div>
    );
  }

  const dist = calculateDistance(camp.coordinates);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <button
            type="button"
            onClick={() => navigate('/medical-assistance')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTe ? 'అన్ని వైద్య శిబిరాలు' : 'All Medical Camps'}</span>
          </button>
        </div>

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-md aspect-[21/9] sm:aspect-[2.4/1] bg-slate-900">
          <img
            src={camp.imageUrl}
            alt={isTe ? camp.nameTe : camp.nameEn}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
            <span className="bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>{camp.status === '24_hours' ? '24x7 Round The Clock' : camp.status}</span>
            </span>
            {camp.isDemo && <DemoBadge />}
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold drop-shadow-md">
              {isTe ? camp.nameTe : camp.nameEn}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>{isTe ? camp.addressTe : camp.addressEn}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>{camp.operatingHours}</span>
              </span>
              {dist !== undefined && (
                <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-medium">
                  📍 {dist} km
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                {isTe ? 'వైద్య సేవలు & వసతులు' : 'Medical Services & Facilities'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isTe ? camp.descTe : camp.descEn}
              </p>

              {camp.doctorInCharge && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-sm text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>{isTe ? 'ఇన్‌చార్జ్ వైద్యులు:' : 'Doctor in charge:'}</strong> {camp.doctorInCharge}
                  </span>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-slate-800 text-sm">
                  {isTe ? 'అందుబాటులో ఉన్న చికిత్సలు:' : 'Available Treatments on-site:'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(isTe ? camp.serviceLabelsTe : camp.serviceLabelsEn).map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-rose-50/60 border border-rose-100 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2"
                    >
                      <HeartPulse className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <DemoBadge variant="banner" />
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {isTe ? 'శిబిరం స్థానం & మ్యాప్' : 'Camp Location Map'}
                  </h3>
                  <p className="text-xs text-slate-500">{isTe ? camp.addressTe : camp.addressEn}</p>
                </div>
                <NavigateButton
                  coordinates={camp.coordinates}
                  userCoords={userCoords}
                  size="md"
                />
              </div>

              <InteractiveMap
                points={[
                  {
                    id: camp.id,
                    type: 'facility',
                    title: isTe ? camp.nameTe : camp.nameEn,
                    subtitle: camp.phone,
                    coordinates: camp.coordinates,
                    isDemo: camp.isDemo,
                  },
                ]}
                center={camp.coordinates}
                zoom={15}
                userCoords={userCoords}
                height="320px"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                {isTe ? 'తక్షణ చర్యలు' : 'Immediate Actions'}
              </h3>
              <a
                href={`tel:${camp.phone}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{isTe ? 'కాల్ చేయండి:' : 'Call Post:'} {camp.phone}</span>
              </a>

              <NavigateButton
                coordinates={camp.coordinates}
                userCoords={userCoords}
                className="w-full justify-center"
                size="lg"
              />
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-medium">{isTe ? 'అంబులెన్స్ సిద్ధంగా ఉంది:' : 'Ambulance Standby:'}</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Ambulance className="w-4 h-4" />
                  {camp.ambulanceAvailable ? (isTe ? 'అవును' : 'Available') : (isTe ? 'లేదు' : 'No')}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-medium">{isTe ? 'చివరిసారి నవీకరించబడింది:' : 'Last Updated:'}</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {camp.lastUpdated}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
