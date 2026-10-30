import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { EventCategory } from '../../types/phase2';
import { useLanguage } from '../../hooks/useLanguage';

interface EventFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: EventCategory | 'all';
  onCategoryChange: (cat: EventCategory | 'all') => void;
  dateFilter: 'all' | 'today' | 'tomorrow' | 'upcoming';
  onDateFilterChange: (df: 'all' | 'today' | 'tomorrow' | 'upcoming') => void;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  dateFilter,
  onDateFilterChange,
}) => {
  const { isTe } = useLanguage();

  const categories: { key: EventCategory | 'all'; labelTe: string; labelEn: string }[] = [
    { key: 'all', labelTe: 'అన్నీ', labelEn: 'All Categories' },
    { key: 'religious', labelTe: 'వేద సభలు', labelEn: 'Religious' },
    { key: 'puja', labelTe: 'పూజలు / స్నానాలు', labelEn: 'Pujas & Baths' },
    { key: 'aarti', labelTe: 'గోదావరి హారతి', labelEn: 'Godavari Aarti' },
    { key: 'cultural', labelTe: 'సాంస్కృతిక వేడుకలు', labelEn: 'Cultural' },
    { key: 'temple', labelTe: 'ఆలయ ఉత్సవాలు', labelEn: 'Temple Events' },
    { key: 'special', labelTe: 'ప్రత్యేక సేవలు', labelEn: 'Special / Seva' },
  ];

  const dateOptions: { key: 'all' | 'today' | 'tomorrow' | 'upcoming'; labelTe: string; labelEn: string }[] = [
    { key: 'all', labelTe: 'అన్ని రోజులు', labelEn: 'All Dates' },
    { key: 'today', labelTe: 'ఈ రోజు', labelEn: 'Today' },
    { key: 'tomorrow', labelTe: 'రేపు', labelEn: 'Tomorrow' },
    { key: 'upcoming', labelTe: 'రాబోయేవి', labelEn: 'Upcoming' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            isTe
              ? 'కార్యక్రమం, వేదిక లేదా శీర్షికతో వెతకండి...'
              : 'Search events by title, venue, or keyword...'
          }
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-godavari-blue-500/20 focus:border-godavari-blue-500 bg-slate-50/50"
        />
      </div>

      {/* Date Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Calendar className="w-3.5 h-3.5" />
          {isTe ? 'సమయం:' : 'Timing:'}
        </span>
        {dateOptions.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onDateFilterChange(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              dateFilter === opt.key
                ? 'bg-godavari-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isTe ? opt.labelTe : opt.labelEn}
          </button>
        ))}
      </div>

      {/* Categories Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" />
          {isTe ? 'వర్గం:' : 'Category:'}
        </span>
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onCategoryChange(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat.key
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isTe ? cat.labelTe : cat.labelEn}
          </button>
        ))}
      </div>
    </div>
  );
};
