import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { PushkaraluEvent } from '../types/phase2';
import { phase2Api } from '../services/phase2Api';
import { useLanguage } from '../hooks/useLanguage';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { DemoBadge } from '../components/common/DemoBadge';
import { NavigateButton } from '../components/common/NavigateButton';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { useGeolocation } from '../hooks/useGeolocation';
import { EventCard } from '../components/events/EventCard';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isTe } = useLanguage();
  const { location: userCoords } = useGeolocation();

  const [event, setEvent] = useState<PushkaraluEvent | null>(null);
  const [allEvents, setAllEvents] = useState<PushkaraluEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      setError(false);
      try {
        const [detail, list] = await Promise.all([
          phase2Api.getEventById(id),
          phase2Api.getEvents(),
        ]);
        if (detail) {
          setEvent(detail);
        } else {
          setError(true);
        }
        setAllEvents(list);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isTe ? event?.titleTe : event?.titleEn,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <LoadingState />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <ErrorState
          messageTe="కార్యక్రమ వివరాలు కనుగొనబడలేదు."
          messageEn="Event not found or failed to load."
          onRetry={() => navigate('/events')}
        />
      </div>
    );
  }

  const relatedEvents = allEvents
    .filter((e) => e.id !== event.id && (e.category === event.category || e.date === event.date))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-godavari-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTe ? 'అన్ని కార్యక్రమాలు' : 'All Events'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? (isTe ? 'లింక్ కాపీ చేయబడింది!' : 'Copied!') : isTe ? 'షేర్ చేయండి' : 'Share'}</span>
          </button>
        </div>

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-md aspect-[21/9] sm:aspect-[2.4/1] bg-slate-900">
          <img
            src={event.imageUrl}
            alt={isTe ? event.titleTe : event.titleEn}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
            <span className="bg-godavari-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {isTe ? event.categoryLabelTe : event.categoryLabelEn}
            </span>
            {event.isDemo && <DemoBadge />}
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold drop-shadow-md">
              {isTe ? event.titleTe : event.titleEn}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-godavari-gold-400" />
                <span>{event.date}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-godavari-gold-400" />
                <span>{event.startTime} - {event.endTime}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-godavari-gold-400" />
                <span>{isTe ? event.venueTe : event.venueEn}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                {isTe ? 'కార్యక్రమ వివరాలు' : 'About this Event'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isTe ? event.descTe : event.descEn}
              </p>
              <div className="pt-2">
                <DemoBadge variant="banner" />
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {isTe ? 'వేదిక స్థానం & మ్యాప్' : 'Venue Location & Map'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isTe ? event.venueTe : event.venueEn}
                  </p>
                </div>
                <NavigateButton
                  coordinates={event.coordinates}
                  userCoords={userCoords}
                  size="md"
                />
              </div>

              <InteractiveMap
                points={[
                  {
                    id: event.id,
                    type: 'ghat',
                    title: isTe ? event.titleTe : event.titleEn,
                    subtitle: isTe ? event.venueTe : event.venueEn,
                    coordinates: event.coordinates,
                    isDemo: event.isDemo,
                  },
                ]}
                center={event.coordinates}
                zoom={15}
                userCoords={userCoords}
                height="320px"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Action Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                {isTe ? 'త్వరిత నావిగేషన్' : 'Quick Navigation'}
              </h3>
              <p className="text-xs text-slate-500">
                {isTe
                  ? 'గూగుల్ మ్యాప్స్ ద్వారా మార్గాన్ని నేరుగా పొందండి.'
                  : 'Open real-time directions to this venue via Google Maps.'}
              </p>
              <NavigateButton
                coordinates={event.coordinates}
                userCoords={userCoords}
                className="w-full justify-center"
                size="lg"
              />
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-base">
                  {isTe ? 'సంబంధిత కార్యక్రమాలు' : 'Related Events'}
                </h3>
                <div className="space-y-4">
                  {relatedEvents.map((rel) => (
                    <EventCard key={rel.id} event={rel} userCoords={userCoords} />
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
