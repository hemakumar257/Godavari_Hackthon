import React, { useState } from 'react';
import { Search, Plus, MapPin, Building2, Waves, Sparkles, Check } from 'lucide-react';
import { YatraStop, StopReferenceType } from '../../types/phase5';
import { DEMO_HERITAGE_LOCATIONS } from '../../data/phase5Data';
import { DEMO_GHATS, DEMO_TEMPLES } from '../../data/phase2Data';
import { useLanguage } from '../../hooks/useLanguage';

interface DestinationSelectorProps {
  onAddStop: (stop: YatraStop) => void;
  existingStopIds: string[];
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  onAddStop,
  existingStopIds,
}) => {
  const { isTe } = useLanguage();
  const [tab, setTab] = useState<StopReferenceType | 'all'>('all');
  const [search, setSearch] = useState('');

  // Collect destinations across Ghats, Temples, and Heritage
  const allDestinations: {
    referenceId: string;
    referenceType: StopReferenceType;
    nameTe: string;
    nameEn: string;
    categoryLabelTe: string;
    categoryLabelEn: string;
    thumbnailUrl: string;
    coordinates: { lat: number; lng: number };
    addressTe: string;
    addressEn: string;
  }[] = [];

  // Ghats
  DEMO_GHATS.forEach((g) => {
    allDestinations.push({
      referenceId: g.id,
      referenceType: 'ghat',
      nameTe: g.nameTe,
      nameEn: g.nameEn,
      categoryLabelTe: 'స్నాన ఘాట్',
      categoryLabelEn: 'Bathing Ghat',
      thumbnailUrl: g.imageUrl,
      coordinates: g.coordinates,
      addressTe: g.addressTe,
      addressEn: g.addressEn,
    });
  });

  // Temples
  DEMO_TEMPLES.forEach((t) => {
    allDestinations.push({
      referenceId: t.id,
      referenceType: 'temple',
      nameTe: t.nameTe,
      nameEn: t.nameEn,
      categoryLabelTe: 'పురాతన ఆలయం',
      categoryLabelEn: 'Temple',
      thumbnailUrl: t.imageUrl,
      coordinates: t.coordinates,
      addressTe: t.addressTe,
      addressEn: t.addressEn,
    });
  });

  // Heritage Locations
  DEMO_HERITAGE_LOCATIONS.forEach((h) => {
    allDestinations.push({
      referenceId: h.id,
      referenceType: 'heritage',
      nameTe: h.nameTe,
      nameEn: h.nameEn,
      categoryLabelTe: h.categoryLabelTe,
      categoryLabelEn: h.categoryLabelEn,
      thumbnailUrl: h.imageUrl,
      coordinates: h.coordinates,
      addressTe: h.addressTe,
      addressEn: h.addressEn,
    });
  });

  // Filtering
  const filtered = allDestinations.filter((d) => {
    if (tab !== 'all' && d.referenceType !== tab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName =
        d.nameEn.toLowerCase().includes(q) || d.nameTe.toLowerCase().includes(q);
      const matchAddress =
        d.addressEn.toLowerCase().includes(q) || d.addressTe.toLowerCase().includes(q);
      return matchName || matchAddress;
    }
    return true;
  });

  const handleSelect = (dest: (typeof allDestinations)[0]) => {
    const newStop: YatraStop = {
      stopId: `stop-${dest.referenceId}-${Date.now()}`,
      referenceType: dest.referenceType,
      referenceId: dest.referenceId,
      nameTe: dest.nameTe,
      nameEn: dest.nameEn,
      categoryLabelTe: dest.categoryLabelTe,
      categoryLabelEn: dest.categoryLabelEn,
      thumbnailUrl: dest.thumbnailUrl,
      coordinates: dest.coordinates,
      sequence: 0, // Assigned by parent
      estimatedDurationMinutes: 60,
      plannedArrivalTime: '09:00 AM',
      addressTe: dest.addressTe,
      addressEn: dest.addressEn,
    };
    onAddStop(newStop);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-godavari-blue-950 text-sm font-telugu flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{isTe ? 'తీర్థ స్థలాన్ని యాత్రకు చేర్చండి' : 'Add Pilgrimage Stop'}</span>
        </h4>
        <span className="text-xs text-slate-400">
          {filtered.length} {isTe ? 'లభ్యత' : 'available'}
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isTe ? 'ఘాట్, ఆలయం లేదా చారిత్రక ప్రదేశం వెతకండి...' : 'Search ghat, temple or heritage place...'}
          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-godavari-turquoise-500 font-telugu"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setTab('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors font-telugu ${
            tab === 'all'
              ? 'bg-godavari-blue-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isTe ? 'అన్నీ' : 'All'}
        </button>
        <button
          type="button"
          onClick={() => setTab('ghat')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 font-telugu ${
            tab === 'ghat'
              ? 'bg-godavari-blue-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Waves className="w-3 h-3" />
          <span>{isTe ? 'ఘాట్లు' : 'Ghats'}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('temple')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 font-telugu ${
            tab === 'temple'
              ? 'bg-godavari-blue-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Building2 className="w-3 h-3" />
          <span>{isTe ? 'ఆలయాలు' : 'Temples'}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('heritage')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 font-telugu ${
            tab === 'heritage'
              ? 'bg-godavari-blue-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <MapPin className="w-3 h-3" />
          <span>{isTe ? 'చారిత్రక క్షేత్రాలు' : 'Heritage'}</span>
        </button>
      </div>

      {/* Destination items list */}
      <div className="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {filtered.map((dest) => {
          const isAdded = existingStopIds.includes(dest.referenceId);
          return (
            <div
              key={`${dest.referenceType}-${dest.referenceId}`}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={dest.thumbnailUrl}
                  alt={isTe ? dest.nameTe : dest.nameEn}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[10px] text-godavari-turquoise-700 font-bold font-telugu">
                    {isTe ? dest.categoryLabelTe : dest.categoryLabelEn}
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate font-telugu">
                    {isTe ? dest.nameTe : dest.nameEn}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {isTe ? dest.addressTe : dest.addressEn}
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={isAdded}
                onClick={() => handleSelect(dest)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors flex items-center gap-1 font-telugu ${
                  isAdded
                    ? 'bg-emerald-50 text-emerald-700 cursor-default'
                    : 'bg-godavari-blue-900 hover:bg-godavari-blue-950 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isTe ? 'చేర్చబడింది' : 'Added'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isTe ? 'చేర్చు' : 'Add'}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
