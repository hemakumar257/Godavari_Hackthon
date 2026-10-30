/**
 * PlanYatraPage – /yatra-planner
 * Phase 5: Personal Pilgrimage & Itinerary Planner Hub
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  Sparkles,
  Calendar,
  Trash2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { YatraItinerary, SuggestedYatraTemplate } from '../types/phase5';
import { phase5Api } from '../services/phase5Api';
import { useLanguage } from '../hooks/useLanguage';
import { DemoBadge } from '../components/common/DemoBadge';
import { SuggestedYatraCard } from '../components/yatra/SuggestedYatraCard';

export const PlanYatraPage: React.FC = () => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  const [savedYatras, setSavedYatras] = useState<YatraItinerary[]>([]);
  const [templates, setTemplates] = useState<SuggestedYatraTemplate[]>([]);

  useEffect(() => {
    // Load local saved yatras
    const userList = phase5Api.getUserYatras();
    setSavedYatras(userList);

    // Load templates
    phase5Api.getSuggestedTemplates().then(setTemplates);
  }, []);

  const handleDeleteYatra = (id: string) => {
    if (window.confirm(isTe ? 'ఈ యాత్రా ప్రణాళికను తొలగించాలా?' : 'Delete this pilgrimage itinerary?')) {
      phase5Api.deleteYatra(id);
      setSavedYatras((prev) => prev.filter((y) => y.id !== id));
    }
  };

  const handleUseTemplate = (template: SuggestedYatraTemplate) => {
    // Instantiate new custom itinerary from template
    const newYatra: YatraItinerary = {
      id: `yatra-${Date.now()}`,
      title: `${template.titleEn} (Customized)`,
      description: template.descEn,
      startDate: '2027-07-15',
      startingLocation: 'Rajahmundry Railway Station / Bus Complex',
      preferences: {
        categories: ['ghat', 'temple', 'heritage'],
        pace: 'moderate',
      },
      stops: template.stops,
      totalDurationHours: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    phase5Api.saveYatra(newYatra);
    navigate(`/yatra-planner/${newYatra.id}`);
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
              <Compass className="w-3.5 h-3.5" />
              <span>{isTe ? 'వ్యక్తిగత పుష్కర యాత్రా ప్రణాళిక' : 'Personal Pilgrimage Itinerary Builder'}</span>
              <span>•</span>
              <DemoBadge />
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-telugu text-white leading-tight">
              {isTe
                ? 'మీ గోదావరి తీర్థ యాత్రను స్వయంగా రూపొందించుకోండి'
                : 'Craft Your Perfect Godavari Pilgrimage'}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-telugu">
              {isTe
                ? 'పవిత్ర స్నాన ఘాట్లు, పురాతన ఆలయాలు, సంధ్యా హారతి మరియు చారిత్రక క్షేత్రాలను ఎంచుకుని మీ సమయానికి అనుగుణంగా యాత్రా మార్గాన్ని రూపొందించుకోండి.'
                : 'Organize your holy Pushkara snanam, temple darshans, and historical visits into an ordered pilgrimage itinerary with turn-by-turn navigation.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/yatra-planner/create"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 font-telugu"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>{isTe ? 'కొత్త యాత్రను ప్రారంభించండి' : 'Create New Itinerary'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* User Saved Yatras Section */}
        {savedYatras.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-godavari-blue-950 font-telugu flex items-center gap-2">
                  <Compass className="w-5 h-5 text-godavari-blue-700" />
                  <span>{isTe ? 'మీరు భద్రపరచిన యాత్రలు' : 'My Saved Itineraries'}</span>
                </h2>
                <p className="text-xs text-slate-500 font-telugu">
                  {isTe
                    ? `${savedYatras.length} యాత్రా ప్రణాళికలు లభ్యతలో ఉన్నాయి`
                    : `${savedYatras.length} saved pilgrimage itineraries`}
                </p>
              </div>

              <Link
                to="/yatra-planner/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-godavari-blue-900 text-white font-bold text-xs hover:bg-godavari-blue-950 transition font-telugu"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isTe ? '+ కొత్త యాత్ర' : '+ New Yatra'}</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedYatras.map((yatra) => (
                <div
                  key={yatra.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-godavari-turquoise-600" />
                        {yatra.startDate}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-godavari-blue-50 text-godavari-blue-800 font-semibold font-telugu">
                        {yatra.stops.length} {isTe ? 'స్థలాలు' : 'stops'}
                      </span>
                    </div>

                    <h3 className="font-bold text-godavari-blue-950 text-base font-telugu line-clamp-1">
                      {yatra.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 font-telugu">
                      {yatra.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteYatra(yatra.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title={isTe ? 'తొలగించు' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/yatra-planner/${yatra.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-godavari-blue-900 hover:bg-godavari-blue-950 text-white font-bold text-xs transition font-telugu"
                    >
                      <span>{isTe ? 'యాత్రను వీక్షించండి' : 'Open Itinerary'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Suggested Pilgrimage Templates */}
        <section className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-godavari-blue-950 font-telugu flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{isTe ? 'సూచించిన పుష్కర యాత్రా నమూనాలు' : 'Curated Pilgrimage Itineraries'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-telugu mt-1">
              {isTe
                ? 'ఏకదిన, ద్విదిన మరియు కుటుంబ సౌకర్యార్థ యాత్రలను ఎంచుకుని మీ అభిరుచికి అనుగుణంగా మార్చుకోండి.'
                : 'Handpicked day plans designed to minimize transit congestion and maximize spiritual fulfillment.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <SuggestedYatraCard
                key={tpl.id}
                template={tpl}
                onUseTemplate={handleUseTemplate}
              />
            ))}
          </div>
        </section>

        {/* Quick Help & Guidelines */}
        <section className="bg-gradient-to-r from-godavari-blue-950 to-godavari-blue-900 text-white rounded-3xl p-6 sm:p-8 border border-godavari-blue-800 shadow-md">
          <div className="max-w-3xl space-y-3">
            <h3 className="text-lg sm:text-xl font-bold font-telugu text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>{isTe ? 'తీర్థ యాత్రా సలహాలు & సూచనలు' : 'Pilgrim Travel Guidelines'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-telugu">
              {isTe
                ? 'ఉదయం వేళల్లో పవిత్ర స్నానాలు మరియు దేవాలయ దర్శనాలు ముగించుకుని, మధ్యాహ్నం వేళల్లో విశ్రాంతి లేదా మ్యూజియంలను సందర్శించడం ఉత్తమం. సాయంత్రం 5:30 గంటలకల్లా పుష్కర ఘాట్‌కు చేరుకోవడం ద్వారా సంధ్యా హారతిని చక్కగా వీక్షించవచ్చు.'
                : 'Schedule early morning hours for sacred Pushkara snanam and temple abhishekam. Utilize midday hours for indoor museums or rest zones, and reach Pushkar Ghat by 5:30 PM to secure seating for the evening Godavari Sandhya Maha Harati.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
