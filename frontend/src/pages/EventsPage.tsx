import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { PushkaraluEvent, EventCategory } from '../types/phase2';
import { phase2Api } from '../services/phase2Api';
import { EventCard } from '../components/events/EventCard';
import { EventFilters } from '../components/events/EventFilters';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { DemoBadge } from '../components/common/DemoBadge';
import { useGeolocation } from '../hooks/useGeolocation';
import { Calendar, Sparkles } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { isTe } = useLanguage();
  const { location: userLocation } = useGeolocation();

  const [events, setEvents] = useState<PushkaraluEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<EventCategory | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'upcoming'>('all');
  const [savedEvents, setSavedEvents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_pushkaralu_events');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const loadEvents = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await phase2Api.getEvents();
      setEvents(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const toggleSave = (id: string) => {
    setSavedEvents((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('saved_pushkaralu_events', JSON.stringify(next));
      return next;
    });
  };

  // Filter events
  const filteredEvents = events.filter((evt) => {
    const title = (isTe ? evt.titleTe : evt.titleEn).toLowerCase();
    const desc = (isTe ? evt.descTe : evt.descEn).toLowerCase();
    const venue = (isTe ? evt.venueTe : evt.venueEn).toLowerCase();
    const s = search.toLowerCase();

    if (search && !title.includes(s) && !desc.includes(s) && !venue.includes(s)) {
      return false;
    }

    if (category !== 'all' && evt.category !== category) {
      return false;
    }

    // Demo date filter simulation
    if (dateFilter === 'today' && !evt.date.endsWith('15')) {
      return false;
    }
    if (dateFilter === 'tomorrow' && !evt.date.endsWith('16')) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-godavari-blue-50 text-godavari-blue-700 border border-godavari-blue-200 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>{isTe ? 'గోదావరి పుష్కరాలు 2027 షెడ్యూల్' : 'Pushkaralu 2027 Schedule'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isTe ? 'కార్యక్రమాలు & పూజా వివరాలు' : 'Events & Auspicious Ceremonies'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isTe
              ? 'గోదావరి మహా హారతులు, వేద సభలు, పవిత్ర స్నాన ముహూర్తాలు మరియు సాంస్కృతిక వేడుకల వివరాలు.'
              : 'Discover auspicious bathing muhurats, Maha Aarti, Vedic discourses, and cultural programs across Rajahmundry.'}
          </p>
          <div className="pt-2">
            <DemoBadge variant="banner" />
          </div>
        </div>

        {/* Filters and Search */}
        <EventFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />

        {/* Saved Items Bar */}
        {savedEvents.length > 0 && (
          <div className="flex items-center justify-between bg-godavari-blue-50/60 border border-godavari-blue-200 rounded-xl px-4 py-2.5 text-xs text-godavari-blue-900">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-godavari-gold-500" />
              {isTe
                ? `మీరు ${savedEvents.length} కార్యక్రమాలను సేవ్ చేసుకున్నారు`
                : `You have saved ${savedEvents.length} events`}
            </span>
            <button
              type="button"
              onClick={() => {
                setSavedEvents([]);
                localStorage.removeItem('saved_pushkaralu_events');
              }}
              className="text-godavari-blue-700 hover:text-godavari-blue-900 font-semibold underline"
            >
              {isTe ? 'అన్నీ తీసివేయండి' : 'Clear All'}
            </button>
          </div>
        )}

        {/* Content Area */}
        {loading ? (
          <LoadingState
            messageTe="కార్యక్రమాల వివరాలు లోడ్ అవుతున్నాయి..."
            messageEn="Loading events schedule..."
          />
        ) : error ? (
          <ErrorState onRetry={loadEvents} />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            titleTe="ఎలాంటి కార్యక్రమాలు కనుగొనబడలేదు"
            titleEn="No events found"
            descTe="మీరు ఎంచుకున్న ఫిల్టర్‌లు లేదా పదాలకు సరిపోలిన కార్యక్రమాలు లేవు. ఫిల్టర్లను రీసెట్ చేయండి."
            descEn="No events match your selected filters. Please adjust or reset them."
            actionTextTe="అన్ని ఫిల్టర్లను రీసెట్ చేయండి"
            actionTextEn="Reset All Filters"
            onAction={() => {
              setSearch('');
              setCategory('all');
              setDateFilter('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                isSaved={savedEvents.includes(evt.id)}
                onToggleSave={toggleSave}
                userCoords={userLocation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
