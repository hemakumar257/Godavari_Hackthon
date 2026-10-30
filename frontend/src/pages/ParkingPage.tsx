import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { ParkingLocation } from '../types/phase2';
import { phase2Api } from '../services/phase2Api';
import { ParkingCard } from '../components/parking/ParkingCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { DemoBadge } from '../components/common/DemoBadge';
import { useGeolocation } from '../hooks/useGeolocation';
import { Car, Search } from 'lucide-react';

export const ParkingPage: React.FC = () => {
  const { isTe } = useLanguage();
  const { location: userLocation, calculateDistance } = useGeolocation();

  const [parkings, setParkings] = useState<ParkingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');

  const loadParking = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await phase2Api.getParking();
      setParkings(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParking();
  }, []);

  const filtered = parkings.filter((p) => {
    const name = (isTe ? p.nameTe : p.nameEn).toLowerCase();
    const addr = (isTe ? p.addressTe : p.addressEn).toLowerCase();
    const s = search.toLowerCase();
    return !search || name.includes(s) || addr.includes(s);
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
            <Car className="w-3.5 h-3.5" />
            <span>{isTe ? 'వాహన పార్కింగ్ సమాచారం' : 'Designated Parking Hubs'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isTe ? 'పుష్కర పార్కింగ్ ప్రదేశాలు & లభ్యత' : 'Pushkaralu Parking & Real-Time Slots'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isTe
              ? 'రాజమహేంద్రవరం నగర ప్రవేశ ద్వారాల వద్ద ఏర్పాటు చేసిన అధికారిక పార్కింగ్ స్థలాలు, కెపాసిటీ మరియు సమీప ఘాట్‌లకు దూరం.'
              : 'Find authorized parking lots with approximate capacity, vehicle categories, and direct Google Maps navigation.'}
          </p>
          <div className="pt-2">
            <DemoBadge variant="banner" />
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isTe
                  ? 'పార్కింగ్ ప్రదేశం పేరుతో వెతకండి...'
                  : 'Search parking by location or name...'
              }
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <LoadingState
            messageTe="పార్కింగ్ సమాచారం లోడ్ అవుతోంది..."
            messageEn="Loading parking facilities..."
          />
        ) : error ? (
          <ErrorState onRetry={loadParking} />
        ) : filtered.length === 0 ? (
          <EmptyState
            titleTe="ఎలాంటి పార్కింగ్ స్థలాలు కనుగొనబడలేదు"
            titleEn="No parking found"
            onAction={() => setSearch('')}
            actionTextTe="వెతుకులాటను క్లియర్ చేయండి"
            actionTextEn="Clear Search"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <ParkingCard
                key={item.id}
                parking={item}
                userCoords={userLocation}
                distanceKm={calculateDistance(item.coordinates)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
