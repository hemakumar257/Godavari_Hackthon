import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, MapPin, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const Footer: React.FC = () => {
  const { setLanguage, isTe } = useLanguage();

  return (
    <footer className="bg-godavari-blue-950 text-slate-300 border-t-4 border-godavari-turquoise-600">
      {/* Top Banner Disclaimer */}
      <div className="bg-godavari-blue-900/80 border-b border-godavari-blue-800/60 py-3 px-4 text-xs">
        <div className="container mx-auto flex items-center justify-center gap-2 text-center text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-telugu">
            {isTe
              ? 'గమనిక: ఇది ఆంధ్రప్రదేశ్ ప్రభుత్వం యొక్క నమూనా డిజిటల్ పోర్టల్. అధికారిక పుష్కరాల తేదీలు, షెడ్యూల్‌లు మరియు హెల్ప్‌లైన్లు ప్రభుత్వం అధికారికంగా ప్రకటించిన తర్వాత పొందుపరచబడతాయి.'
              : 'Notice: This is an official demonstration pilot platform under Govt. of Andhra Pradesh. Official festival schedules, dates, and dedicated helplines will be synchronized upon official state notification.'}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column with Both Logos Cleanly Separated */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* AP Govt Logo */}
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center border border-amber-400/40 shadow-xs shrink-0">
                <img
                  src="/icons/ap-govt-logo.png"
                  alt="Government of Andhra Pradesh"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Website Festival Logo */}
              <div className="w-12 h-12 rounded-xl bg-godavari-turquoise-500/20 p-1 flex items-center justify-center border border-godavari-turquoise-400/30 shrink-0">
                <img src="/icons/logo.svg" alt="Godavari Pushkaralu" className="w-9 h-9 object-contain" />
              </div>

              <div className="flex flex-col">
                <h3 className="text-white font-extrabold text-base tracking-wide font-telugu">
                  {isTe ? 'గోదావరి పుష్కరాలు 2027' : 'Godavari Pushkaralu 2027'}
                </h3>
                <p className="text-godavari-turquoise-400 text-xs font-semibold tracking-wider uppercase font-telugu">
                  {isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'Govt. of Andhra Pradesh'}
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed font-telugu">
              {isTe
                ? 'పవిత్ర గోదావరి పుష్కర యాత్రికులకు సమగ్ర సమాచారం, రాజమహేంద్రవరం ఘాట్‌ల మార్గదర్శకత్వం, ప్రత్యక్ష ప్రసారాలు మరియు అత్యవసర సహాయాన్ని అందించే అధికారిక డిజిటల్ వేదిక.'
                : 'An integrated digital pilgrim experience and heritage access platform delivering comprehensive information, ghat navigation, authorized live broadcasts and public safety.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-telugu">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {isTe ? 'అధికారిక పైలట్ సిస్టమ్' : 'Official Pilot Platform'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-godavari-turquoise-400"></span>
              {isTe ? 'త్వరిత లింకులు' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2.5 text-sm font-telugu">
              <li>
                <Link to="/" className="hover:text-godavari-turquoise-300 transition">
                  {isTe ? 'హోమ్‌పేజీ' : 'Home'}
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-godavari-turquoise-300 transition">
                  {isTe ? 'కార్యక్రమాలు & పూజా సమయాలు' : 'Events & Schedule'}
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-godavari-turquoise-300 transition">
                  {isTe ? 'స్నాన ఘాట్‌లు & రూట్ మ్యాప్' : 'Bathing Ghats & Maps'}
                </Link>
              </li>
              <li>
                <Link to="/live" className="hover:text-godavari-turquoise-300 transition">
                  {isTe ? 'లైవ్ పుష్కర దర్శనం' : 'Live Pushkaralu Streams'}
                </Link>
              </li>
              <li>
                <Link to="/heritage" className="hover:text-godavari-turquoise-300 transition">
                  {isTe ? 'గోదావరి వారసత్వ పరిచయం' : 'Godavari Heritage & History'}
                </Link>
              </li>
              <li>
                <Link to="/plan-yatra" className="hover:text-godavari-turquoise-300 transition flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isTe ? 'వ్యక్తిగత యాత్ర ప్లానర్' : 'Personal Yatra Planner'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Assistance & Safety */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              {isTe ? 'రక్షణ & ప్రజా సహాయం' : 'Safety & Assistance'}
            </h4>
            <ul className="space-y-2.5 text-sm font-telugu">
              <li>
                <Link to="/medical-assistance" className="hover:text-rose-300 transition flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>{isTe ? 'వైద్య సహాయ కేంద్రాలు' : 'Medical Camp Directory'}</span>
                </Link>
              </li>
              <li>
                <Link to="/police-assistance" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isTe ? 'పోలీస్ హెల్ప్ డెస్క్‌లు' : 'Police Help Desks'}</span>
                </Link>
              </li>
              <li>
                <Link to="/nearby-facilities" className="hover:text-godavari-turquoise-300 transition flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-godavari-turquoise-400" />
                  <span>{isTe ? 'ప్రజా సౌకర్యాలు (నీరు, వసతి)' : 'Public Amenities Finder'}</span>
                </Link>
              </li>
              <li className="pt-2 text-xs text-slate-400">
                <span className="block font-semibold text-slate-300 mb-1 font-telugu">
                  {isTe ? 'జాతీయ అత్యవసర నంబర్లు:' : 'National Helplines:'}
                </span>
                <span className="text-amber-300 font-mono">112 (పోలీస్ / అత్యవసరం) | 108 (అంబులెన్స్)</span>
              </li>
            </ul>
          </div>

          {/* Language Selection: Telugu and English only */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              {isTe ? 'భాష ఎంపిక' : 'Language Selection'}
            </h4>
            <p className="text-xs text-slate-400 mb-3 font-telugu">
              {isTe
                ? 'ఈ వేదిక తెలుగు మరియు ఆంగ్ల భాషలలో మాత్రమే అందుబాటులో ఉంది.'
                : 'Available exclusively in Telugu and English for visiting pilgrims.'}
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setLanguage('te')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition ${
                  isTe
                    ? 'bg-godavari-turquoise-600 text-white border-godavari-turquoise-500 shadow-sm'
                    : 'bg-godavari-blue-900 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                తెలుగు (Telugu)
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition ${
                  !isTe
                    ? 'bg-godavari-turquoise-600 text-white border-godavari-turquoise-500 shadow-sm'
                    : 'bg-godavari-blue-900 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
            <div className="mt-6 pt-4 border-t border-godavari-blue-800/70">
              <span className="text-[11px] text-slate-400 block font-telugu">
                {isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం • దేవాదాయ & ధర్మాదాయ శాఖ' : 'Govt. of Andhra Pradesh • Endowments Department'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-godavari-blue-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="font-telugu">
            © 2026-2027 <strong>ఆంధ్రప్రదేశ్ ప్రభుత్వం | Government of Andhra Pradesh</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 font-telugu">
              {isTe ? 'రాజమహేంద్రవరం ద్వాదశ పుష్కర మహోత్సవం 2027' : 'Rajamahendravaram Maha Pushkaralu 2027'}
            </span>
            <span className="text-slate-400">Phase 1 Foundation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
