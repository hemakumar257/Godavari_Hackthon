import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Facility, FacilityCategory } from '../types/phase2';
import { phase2Api } from '../services/phase2Api';
import { FacilityCard } from '../components/facilities/FacilityCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { DemoBadge } from '../components/common/DemoBadge';
import { useGeolocation } from '../hooks/useGeolocation';
import {
  Compass,
  Search,
  Droplets,
  Cross,
  Coffee,
  Shield,
  CreditCard,
  HelpCircle,
} from 'lucide-react';

export const NearbyFacilitiesPage: React.FC = () => {
  const { isTe } = useLanguage();
  const { location: userLocation, calculateDistance } = useGeolocation();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<FacilityCategory | 'all'>('all');

  const loadFacilities = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await phase2Api.getFacilities();
      setFacilities(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  const categories: { key: FacilityCategory | 'all'; labelTe: string; labelEn: string; icon: React.ReactNode }[] = [
    { key: 'all', labelTe: 'అన్ని సదుపాయాలు', labelEn: 'All Facilities', icon: <Compass className="w-3.5 h-3.5" /> },
    { key: 'drinking_water', labelTe: 'తాగునీరు', labelEn: 'Drinking Water', icon: <Droplets className="w-3.5 h-3.5" /> },
    { key: 'toilet', labelTe: 'మరుగుదొడ్లు', labelEn: 'Toilets', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { key: 'medical', labelTe: 'వైద్య శిబిరం', labelEn: 'Medical', icon: <Cross className="w-3.5 h-3.5" /> },
    { key: 'police', labelTe: 'పోలీస్ సహాయం', labelEn: 'Police Help', icon: <Shield className="w-3.5 h-3.5" /> },
    { key: 'food_stall', labelTe: 'ఆహారం / అల్పాహారం', labelEn: 'Food Stalls', icon: <Coffee className="w-3.5 h-3.5" /> },
    { key: 'atm', labelTe: 'ATM', labelEn: 'ATM / Cash', icon: <CreditCard className="w-3.5 h-3.5" /> },
  ];

  const filtered = facilities.filter((f) => {
    const name = (isTe ? f.nameTe : f.nameEn).toLowerCase();
    const catLabel = (isTe ? f.categoryLabelTe : f.categoryLabelEn).toLowerCase();
    const addr = (isTe ? f.addressTe : f.addressEn).toLowerCase();
    const s = search.toLowerCase();

    if (search && !name.includes(s) && !catLabel.includes(s) && !addr.includes(s)) {
      return false;
    }

    if (category !== 'all' && f.category !== category) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isTe ? 'యాత్రికుల పౌర సేవలు' : 'Essential Pilgrim Facilities'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isTe ? 'సమీప పౌర సదుపాయాల కేంద్రాలు' : 'Nearby Public Amenities & Support'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isTe
              ? 'తాగునీటి కేంద్రాలు, మరుగుదొడ్లు, ఉచిత భోజన శాలలు, విశ్రాంతి గదులు మరియు సహాయ కేంద్రాలు.'
              : 'Quickly find verified drinking water kiosks, sanitation complexes, food courts, and emergency support.'}
          </p>
          <div className="pt-2">
            <DemoBadge variant="banner" />
          </div>
        </div>

        {/* Search & Category Pills */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isTe
                  ? 'సౌకర్యం పేరు లేదా ప్రాంతంతో వెతకండి...'
                  : 'Search facility by name or location...'
              }
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  category === c.key
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.icon}
                <span>{isTe ? c.labelTe : c.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Facility cards */}
        {loading ? (
          <LoadingState
            messageTe="సౌకర్యాల వివరాలు లోడ్ అవుతున్నాయి..."
            messageEn="Loading nearby amenities..."
          />
        ) : error ? (
          <ErrorState onRetry={loadFacilities} />
        ) : filtered.length === 0 ? (
          <EmptyState
            titleTe="ఎలాంటి సౌకర్యాలు కనుగొనబడలేదు"
            titleEn="No facilities found"
            onAction={() => {
              setSearch('');
              setCategory('all');
            }}
            actionTextTe="ఫిల్టర్లు రీసెట్ చేయండి"
            actionTextEn="Reset Filters"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((fac) => (
              <FacilityCard
                key={fac.id}
                facility={fac}
                userCoords={userLocation}
                distanceKm={calculateDistance(fac.coordinates)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
