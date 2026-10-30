/**
 * CreateYatraPage – /yatra-planner/create
 * Phase 5: Multi-step interactive pilgrimage itinerary builder
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { YatraItinerary, YatraStop, HeritageLocation } from '../types/phase5';
import { phase5Api } from '../services/phase5Api';
import { useLanguage } from '../hooks/useLanguage';
import { DestinationSelector } from '../components/yatra/DestinationSelector';
import { ItineraryStopCard } from '../components/yatra/ItineraryStopCard';
import { InteractiveMap } from '../components/map/InteractiveMap';

export const CreateYatraPage: React.FC = () => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();
  const locationState = useLocation().state as { preselectLocation?: HeritageLocation } | undefined;

  // Form State
  const [title, setTitle] = useState(isTe ? 'నా పవిత్ర గోదావరి యాత్ర' : 'My Sacred Godavari Pilgrimage');
  const [description] = useState(
    isTe
      ? 'గోదావరి పుష్కరాల పవిత్ర స్నానం మరియు ముఖ్య ఆలయాల దర్శన యాత్రా ప్రణాళిక.'
      : 'Personalized pilgrimage itinerary for holy bath, temple darshan, and Godavari Aarti.'
  );
  const [startDate, setStartDate] = useState('2027-07-15');
  const [startingLocation, setStartingLocation] = useState('Rajahmundry Railway Station');
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'intensive'>('moderate');
  const [stops, setStops] = useState<YatraStop[]>([]);
  const [activeTab, setActiveTab] = useState<'stops' | 'map'>('stops');

  // Prepopulate if arriving from a heritage card "Add to Yatra" action
  useEffect(() => {
    if (locationState?.preselectLocation) {
      const loc = locationState.preselectLocation;
      const initialStop: YatraStop = {
        stopId: `stop-pre-${loc.id}-${Date.now()}`,
        referenceType: 'heritage',
        referenceId: loc.id,
        nameTe: loc.nameTe,
        nameEn: loc.nameEn,
        categoryLabelTe: loc.categoryLabelTe,
        categoryLabelEn: loc.categoryLabelEn,
        thumbnailUrl: loc.imageUrl,
        coordinates: loc.coordinates,
        sequence: 1,
        plannedArrivalTime: '08:00 AM',
        estimatedDurationMinutes: 60,
        addressTe: loc.addressTe,
        addressEn: loc.addressEn,
      };
      setStops([initialStop]);
    }
  }, [locationState]);

  const handleAddStop = (newStop: YatraStop) => {
    setStops((prev) => [
      ...prev,
      {
        ...newStop,
        sequence: prev.length + 1,
      },
    ]);
  };

  const handleRemoveStop = (stopId: string) => {
    setStops((prev) =>
      prev
        .filter((s) => s.stopId !== stopId)
        .map((s, idx) => ({ ...s, sequence: idx + 1 }))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setStops((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy.map((s, idx) => ({ ...s, sequence: idx + 1 }));
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === stops.length - 1) return;
    setStops((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy.map((s, idx) => ({ ...s, sequence: idx + 1 }));
    });
  };

  const handleUpdateArrivalTime = (stopId: string, time: string) => {
    setStops((prev) =>
      prev.map((s) => (s.stopId === stopId ? { ...s, plannedArrivalTime: time } : s))
    );
  };

  const handleUpdateDuration = (stopId: string, durationMinutes: number) => {
    setStops((prev) =>
      prev.map((s) =>
        s.stopId === stopId ? { ...s, estimatedDurationMinutes: durationMinutes } : s
      )
    );
  };

  const handleUpdateNotes = (stopId: string, notes: string) => {
    setStops((prev) =>
      prev.map((s) => (s.stopId === stopId ? { ...s, customNotes: notes } : s))
    );
  };

  const handleSaveItinerary = () => {
    if (stops.length === 0) {
      alert(isTe ? 'దయచేసి కనీసం ఒక ఆగడాన్ని యాత్రకు చేర్చండి.' : 'Please add at least one stop to your itinerary.');
      return;
    }

    const newYatra: YatraItinerary = {
      id: `yatra-${Date.now()}`,
      title,
      description,
      startDate,
      startingLocation,
      preferences: {
        categories: ['ghat', 'temple', 'heritage'],
        pace,
      },
      stops,
      totalDurationHours: Math.round(
        stops.reduce((acc, s) => acc + s.estimatedDurationMinutes, 0) / 60
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    phase5Api.saveYatra(newYatra);
    navigate(`/yatra-planner/${newYatra.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/yatra-planner"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-godavari-blue-600 transition font-telugu"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTe ? 'యాత్రా హబ్‌కు తిరిగి వెళ్ళు' : 'Back to Yatra Hub'}</span>
          </Link>

          <button
            type="button"
            onClick={handleSaveItinerary}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-godavari-blue-900 hover:bg-godavari-blue-950 text-white font-bold text-xs sm:text-sm shadow-md transition font-telugu"
          >
            <Save className="w-4 h-4 text-godavari-turquoise-300" />
            <span>{isTe ? 'యాత్రను భద్రపరచండి' : 'Save Itinerary'}</span>
          </button>
        </div>

        {/* Page Heading */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-godavari-blue-950 font-telugu">
            {isTe ? 'వ్యక్తిగత యాత్రా రూపకల్పన' : 'Create Custom Pilgrimage Plan'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-telugu mt-1">
            {isTe
              ? 'తీర్థ స్థలాలను ఎంచుకుని క్రమబద్ధీకరించండి. మీ ప్రయాణ సమయాన్ని మరియు ఆగిన సమయాన్ని సులభంగా నిర్వహించండి.'
              : 'Select your preferred bathing ghats, temples, and heritage sites. Organize the sequence with live transit guidance.'}
          </p>
        </div>

        {/* Itinerary Configuration Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-telugu">
                {isTe ? 'యాత్ర పేరు' : 'Yatra Title'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-godavari-turquoise-500 font-telugu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-telugu">
                {isTe ? 'ప్రయాణ ప్రారంభ తేదీ' : 'Pilgrimage Date'}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-godavari-turquoise-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-telugu">
                {isTe ? 'ప్రారంభ ప్రదేశం' : 'Starting Location'}
              </label>
              <input
                type="text"
                value={startingLocation}
                onChange={(e) => setStartingLocation(e.target.value)}
                placeholder="Rajahmundry Railway Station"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-godavari-turquoise-500 font-telugu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-telugu">
                {isTe ? 'ప్రయాణ వేగం (Pace)' : 'Travel Pace'}
              </label>
              <select
                value={pace}
                onChange={(e) => setPace(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-godavari-turquoise-500 font-telugu"
              >
                <option value="relaxed">{isTe ? 'ప్రశాంతమైన ప్రయాణం (Relaxed)' : 'Relaxed (Fewer stops)'}</option>
                <option value="moderate">{isTe ? 'సాధారణ ప్రయాణం (Moderate)' : 'Moderate (Standard pace)'}</option>
                <option value="intensive">{isTe ? 'పూర్తి దర్శనాలు (Intensive)' : 'Intensive (Cover maximum)'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Builder Workspace: Left (Destination Picker) vs Right (Stops list / Map) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Destination Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <DestinationSelector
              onAddStop={handleAddStop}
              existingStopIds={stops.map((s) => s.referenceId)}
            />
          </div>

          {/* Right: Ordered Stops & Map Tabs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-4 font-telugu">
                <button
                  type="button"
                  onClick={() => setActiveTab('stops')}
                  className={`text-sm font-bold pb-2 border-b-2 transition-all ${
                    activeTab === 'stops'
                      ? 'border-godavari-blue-900 text-godavari-blue-950'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {isTe ? 'యాత్రా మార్గం' : 'Itinerary Sequence'} ({stops.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('map')}
                  className={`text-sm font-bold pb-2 border-b-2 transition-all ${
                    activeTab === 'map'
                      ? 'border-godavari-blue-900 text-godavari-blue-950'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {isTe ? 'నక్షా (Map View)' : 'Interactive Map'}
                </button>
              </div>

              <div className="text-xs text-slate-500 font-telugu">
                {stops.length} {isTe ? 'ఆగడాలు ఎంచుకోబడ్డాయి' : 'stops selected'}
              </div>
            </div>

            {activeTab === 'stops' && (
              <div className="space-y-3">
                {stops.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-2">
                    <Compass className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="font-bold text-slate-700 text-sm font-telugu">
                      {isTe ? 'ఇంకా ఎటువంటి స్థలాలు చేర్చబడలేదు' : 'No stops added yet'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-telugu">
                      {isTe
                        ? 'ఎడమ వైపు ఉన్న ప్యానెల్ నుండి ఘాట్లు, ఆలయాలు మరియు చారిత్రక ప్రదేశాలను యాత్రకు చేర్చండి.'
                        : 'Pick destinations from the left panel to begin building your pilgrimage itinerary.'}
                    </p>
                  </div>
                ) : (
                  stops.map((stop, index) => (
                    <ItineraryStopCard
                      key={stop.stopId}
                      stop={stop}
                      index={index}
                      totalStops={stops.length}
                      onRemove={handleRemoveStop}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onUpdateNotes={handleUpdateNotes}
                      onUpdateDuration={handleUpdateDuration}
                      onUpdateArrivalTime={handleUpdateArrivalTime}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'map' && (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-4 space-y-3">
                <div className="h-96 rounded-2xl overflow-hidden border border-slate-100">
                  <InteractiveMap
                    center={{ lat: 16.993, lng: 81.768 }}
                    zoom={13}
                    height="100%"
                    points={stops.map((s, idx) => ({
                      id: s.stopId,
                      type: s.referenceType === 'ghat' ? 'ghat' : s.referenceType === 'temple' ? 'temple' : 'facility',
                      title: `${idx + 1}. ${isTe ? s.nameTe : s.nameEn}`,
                      subtitle: `${s.plannedArrivalTime || ''} (${s.estimatedDurationMinutes} mins)`,
                      coordinates: s.coordinates,
                      isDemo: true,
                    }))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
