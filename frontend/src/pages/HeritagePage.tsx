/**
 * HeritagePage – /heritage
 * Phase 5: Heritage Explorer Landing Page
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  BookOpen,
  Image as ImageIcon,
  Landmark,
} from 'lucide-react';
import { HeritageLocation, HeritageCategory, HeritageStory, GalleryItem } from '../types/phase5';
import { phase5Api } from '../services/phase5Api';
import { useLanguage } from '../hooks/useLanguage';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { DemoBadge } from '../components/common/DemoBadge';
import { HeritageCard } from '../components/heritage/HeritageCard';
import { HeritageStoryCard } from '../components/heritage/HeritageStoryCard';
import { HeritageGallery } from '../components/heritage/HeritageGallery';

const CATEGORIES: { key: HeritageCategory | 'all'; labelTe: string; labelEn: string }[] = [
  { key: 'all', labelTe: 'అన్ని విశేషాలు', labelEn: 'All Heritage' },
  { key: 'historical_place', labelTe: 'చారిత్రక ప్రదేశాలు', labelEn: 'Historical Places' },
  { key: 'river_heritage', labelTe: 'గోదావరి నదీ వైభవం', labelEn: 'River Heritage' },
  { key: 'ancient_temple', labelTe: 'పురాతన ఆలయాలు', labelEn: 'Ancient Temples' },
  { key: 'spiritual_place', labelTe: 'ఆధ్యాత్మిక క్షేత్రాలు', labelEn: 'Spiritual Places' },
  { key: 'cultural_heritage', labelTe: 'సాంస్కృతిక కేంద్రాలు', labelEn: 'Cultural Heritage' },
];

export const HeritagePage: React.FC = () => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  const [locations, setLocations] = useState<HeritageLocation[]>([]);
  const [stories, setStories] = useState<HeritageStory[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HeritageCategory | 'all'>('all');
  const [activeSection, setActiveSection] = useState<'destinations' | 'stories' | 'gallery'>('destinations');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(false);
        const [locData, storiesData, galleryData] = await Promise.all([
          phase5Api.getHeritageLocations(),
          phase5Api.getHeritageStories(),
          phase5Api.getGalleryItems(),
        ]);
        setLocations(locData);
        setStories(storiesData);
        setGallery(galleryData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredLocations = locations.filter((loc) => {
    if (selectedCategory !== 'all' && loc.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName =
        loc.nameEn.toLowerCase().includes(q) || loc.nameTe.toLowerCase().includes(q);
      const matchDesc =
        loc.shortDescEn.toLowerCase().includes(q) || loc.shortDescTe.toLowerCase().includes(q);
      return matchName || matchDesc;
    }
    return true;
  });

  const handleAddToYatra = (loc: HeritageLocation) => {
    navigate('/yatra-planner/create', { state: { preselectLocation: loc } });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="bg-godavari-blue-950 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-godavari-blue-950 via-godavari-blue-900 to-godavari-turquoise-950/60 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-godavari-turquoise-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-godavari-turquoise-800/40 border border-godavari-turquoise-600/40 text-xs font-semibold text-godavari-turquoise-300 font-telugu">
              <Landmark className="w-3.5 h-3.5" />
              <span>{isTe ? 'గోదావరి సంస్కృతి & చారిత్రక వైభవం' : 'Sacred Culture & Heritage Explorer'}</span>
              <span>•</span>
              <DemoBadge />
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-telugu text-white leading-tight">
              {isTe
                ? 'పవిత్ర గోదావరి నదీ తీర వారసత్వ దర్శనం'
                : 'Heritage of the Sacred Godavari Basin'}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-telugu">
              {isTe
                ? 'శతాబ్దాల ప్రాచీన ఆలయాలు, సర్ ఆర్థర్ కాటన్ ఇంజనీరింగ్ అద్భుతాలు, తెలుగు భాషా సాహిత్య వికాస కేంద్రాలు మరియు పవిత్ర పుష్కర సంస్కృతిని అన్వేషించండి.'
                : 'Discover ancient Chalukyan shrines, Sir Arthur Cotton’s engineering feats, literary cradles of the Telugu language, and the timeless spiritual heritage of Dakshina Ganga.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/yatra-planner"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 font-telugu"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                <span>{isTe ? 'వ్యక్తిగత యాత్రను ప్లాన్ చేయండి' : 'Plan Personal Yatra'}</span>
              </Link>
              <button
                type="button"
                onClick={() => setActiveSection('stories')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 font-telugu"
              >
                <BookOpen className="w-4 h-4 text-godavari-turquoise-300" />
                <span>{isTe ? 'పురాణ కథనాలు చదవండి' : 'Read Sacred Legends'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-200 bg-white sticky top-16 z-30 shadow-2xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-3 font-telugu">
            <button
              type="button"
              onClick={() => setActiveSection('destinations')}
              className={`pb-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeSection === 'destinations'
                  ? 'border-godavari-blue-900 text-godavari-blue-950'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>{isTe ? 'చారిత్రక క్షేత్రాలు' : 'Heritage Sites'} ({locations.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('stories')}
              className={`pb-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeSection === 'stories'
                  ? 'border-godavari-blue-900 text-godavari-blue-950'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isTe ? 'పవిత్ర కథనాలు & పురాణాలు' : 'Stories & Mythology'} ({stories.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('gallery')}
              className={`pb-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeSection === 'gallery'
                  ? 'border-godavari-blue-900 text-godavari-blue-950'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{isTe ? 'ఛాయాచిత్ర ప్రదర్శన' : 'Heritage Gallery'} ({gallery.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading && (
          <LoadingState
            messageTe="వారసత్వ వివరాలు లోడ్ అవుతున్నాయి..."
            messageEn="Loading heritage destinations & stories..."
          />
        )}

        {error && !loading && (
          <ErrorState
            messageTe="వారసత్వ సమాచారం లోడ్ చేయడంలో లోపం ఏర్పడింది."
            messageEn="Failed to load heritage explorer data."
            onRetry={() => window.location.reload()}
          />
        )}

        {!loading && !error && activeSection === 'destinations' && (
          <div className="space-y-8">
            {/* Search and Category Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isTe ? 'చారిత్రక క్షేత్రం లేదా ఆలయం పేరుతో వెతకండి...' : 'Search by heritage name or description...'}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-godavari-turquoise-500 font-telugu"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setSelectedCategory(c.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors font-telugu ${
                      selectedCategory === c.key
                        ? 'bg-godavari-blue-950 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isTe ? c.labelTe : c.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Content count */}
            <div className="text-xs text-slate-500 font-telugu">
              {isTe
                ? `${filteredLocations.length} చారిత్రక క్షేత్రాలు కనుగొనబడ్డాయి`
                : `${filteredLocations.length} heritage sites found`}
            </div>

            {filteredLocations.length === 0 ? (
              <EmptyState
                titleTe="ప్రదేశాలు కనుగొనబడలేదు"
                titleEn="No Destinations Found"
                descTe="మీ శోధనకు సరిపోయే వారసత్వ క్షేత్రాలు లేవు."
                descEn="Try adjusting your search query or category filters."
                actionTextTe="అన్నీ చూపించు"
                actionTextEn="Show All"
                onAction={() => {
                  setSearch('');
                  setSelectedCategory('all');
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.map((loc) => (
                  <HeritageCard
                    key={loc.id}
                    location={loc}
                    onAddToYatra={handleAddToYatra}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && !error && activeSection === 'stories' && (
          <div className="space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold font-telugu text-godavari-blue-950">
                {isTe ? 'గోదావరి నదీ పురాణాలు & చారిత్రక గాథలు' : 'Sacred River Legends & Historical Chronicles'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-telugu mt-1">
                {isTe
                  ? 'గౌతమ మహర్షి తపస్సు, నదీ ఆవిర్భావం మరియు పుష్కరాల పవిత్ర సంప్రదాయాలపై ప్రామాణిక కథనాలు.'
                  : 'Educational and cultural chronicles narrating the theological and literary heritage of Rajahmundry.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <HeritageStoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        )}

        {!loading && !error && activeSection === 'gallery' && (
          <div className="space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold font-telugu text-godavari-blue-950">
                {isTe ? 'గోదావరి ఛాయాచిత్ర ప్రదర్శన' : 'Godavari Basin Photographic Gallery'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-telugu mt-1">
                {isTe
                  ? 'నదీ తీరాలు, ఇంజనీరింగ్ వారధులు, మహా హారతి మరియు పవిత్ర స్నాన ఘాట్ల సుందర దృశ్యాలు.'
                  : 'High-resolution authorized imagery capturing the spiritual majesty of River Godavari and sacred ghats.'}
              </p>
            </div>

            <HeritageGallery items={gallery} />
          </div>
        )}
      </div>
    </div>
  );
};
