import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  ShieldAlert,
  PhoneCall,
  MapPin,
  ArrowRight,
  Ambulance,
  LifeBuoy,
  Info,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';

export const MedicalPolicePreview: React.FC = () => {
  const { isTe } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          titleTe="వైద్య & పోలీస్ భద్రతా సహాయం"
          titleEn="Medical & Public Safety Assistance"
          subtitleTe="యాత్రికుల క్షేమం మరియు అత్యవసర సహాయం కోసం 24x7 రక్షణ వ్యవస్థ"
          subtitleEn="Round-the-clock emergency medical response and police pilgrim assistance"
          isTe={isTe}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Medical Assistance Card */}
          <div className="bg-rose-50/50 rounded-2xl p-6 sm:p-8 border border-rose-100 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/30 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <Badge variant="danger" size="sm">
                  {isTe ? 'అత్యవసర వైద్యం' : 'Emergency Health'}
                </Badge>
              </div>

              <h3 className="text-xl font-bold text-slate-900 font-telugu mb-2">
                {isTe ? 'వైద్య సహాయ కేంద్రాలు & 108 అంబులెన్స్' : 'Medical Camps & Ambulance Support'}
              </h3>

              <p className="text-sm text-slate-600 mb-6 leading-relaxed font-telugu">
                {isTe
                  ? 'ప్రధాన ఘాట్‌ల వద్ద ప్రాథమిక చికిత్సా కేంద్రాలు, జీవ రక్షక మందులు, హీట్‌స్ట్రోక్ వార్డులు మరియు 108 అంబులెన్స్ సేవలు నిరంతరం అందుబాటులో ఉంటాయి.'
                  : 'First aid posts, essential emergency drugs, heat mitigation centres, and ambulance rapid-response stationed at major bathing ghats.'}
              </p>

              <div className="space-y-3 bg-white/90 rounded-xl p-4 border border-rose-100 mb-6 text-xs sm:text-sm font-telugu">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <Ambulance className="w-4 h-4 text-rose-600" />
                    {isTe ? 'జాతీయ అంబులెన్స్ హెల్ప్‌లైన్:' : 'National Ambulance Service:'}
                  </span>
                  <a
                    href="tel:108"
                    className="font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-md border border-rose-200 hover:bg-rose-100 transition font-sans"
                  >
                    108
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <PhoneCall className="w-4 h-4 text-rose-600" />
                    {isTe ? 'జాతీయ అత్యవసర కాల్:' : 'Unified National Emergency:'}
                  </span>
                  <a
                    href="tel:112"
                    className="font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-md border border-rose-200 hover:bg-rose-100 transition font-sans"
                  >
                    112
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-rose-100 flex items-center justify-between font-telugu">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-rose-500" />
                {isTe ? 'శిబిరాల వివరాలు Phase 3 లో పొందుపరచబడును' : 'Camp directory active in Phase 3'}
              </span>
              <Link
                to="/medical-assistance"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-700 hover:text-rose-800"
              >
                <span>{isTe ? 'వైద్య కేంద్రాల జాబితా' : 'Find Medical Camp'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Police Assistance Card */}
          <div className="bg-amber-50/50 rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/20">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <Badge variant="saffron" size="sm">
                  {isTe ? 'ప్రజా రక్షణ' : 'Public Safety'}
                </Badge>
              </div>

              <h3 className="text-xl font-bold text-slate-900 font-telugu mb-2">
                {isTe ? 'పోలీస్ హెల్ప్ డెస్క్‌లు & రక్షణ' : 'Police Help Desks & Safety'}
              </h3>

              <p className="text-sm text-slate-600 mb-6 leading-relaxed font-telugu">
                {isTe
                  ? 'ప్రతి ఘాట్ మరియు రద్దీ కూడలి వద్ద పోలీస్ సహాయ కేంద్రాలు, తప్పిపోయిన వారి ఆచూకీ (Lost & Found), మరియు క్రౌడ్ నియంత్రణ సహాయక బృందాలు.'
                  : 'Dedicated police outposts, child tag identification, missing person registration, crowd routing, and river security teams.'}
              </p>

              <div className="space-y-3 bg-white/90 rounded-xl p-4 border border-amber-200/70 mb-6 text-xs sm:text-sm font-telugu">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <LifeBuoy className="w-4 h-4 text-amber-600" />
                    {isTe ? 'పోలీస్ హెల్ప్‌లైన్ / అత్యవసరం:' : 'Police Emergency Helpline:'}
                  </span>
                  <a
                    href="tel:112"
                    className="font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-md border border-amber-200 hover:bg-amber-100 transition font-sans"
                  >
                    112 / 100
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    {isTe ? 'పుష్కర ప్రత్యేక కంట్రోల్ రూమ్:' : 'Festival Control Room:'}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {isTe ? 'త్వరలో విడుదల కానుంది' : 'To be published soon'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-200/60 flex items-center justify-between font-telugu">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                {isTe ? 'ఫిర్యాదు & నివేదిక వ్యవస్థ Phase 3 లో' : 'Report system active in Phase 3'}
              </span>
              <Link
                to="/police-assistance"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-900 hover:text-amber-950"
              >
                <span>{isTe ? 'పోలీస్ డెస్క్ వివరాలు' : 'Police Directory'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
