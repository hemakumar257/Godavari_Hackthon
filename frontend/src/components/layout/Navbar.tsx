import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Globe, ShieldAlert, HeartPulse, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const Navbar: React.FC = () => {
  const { language, setLanguage, isTe } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'te' ? 'en' : 'te');
  };

  const navLinks = [
    { to: '/', labelTe: 'హోమ్', labelEn: 'Home' },
    { to: '/events', labelTe: 'కార్యక్రమాలు', labelEn: 'Events' },
    { to: '/explore', labelTe: 'స్నాన ఘాట్లు', labelEn: 'Ghats' },
    { to: '/heritage', labelTe: 'వారసత్వం', labelEn: 'Heritage' },
    { to: '/yatra-planner', labelTe: 'యాత్ర ప్లానర్', labelEn: 'Yatra Planner' },
    { to: '/medical-assistance', labelTe: 'వైద్యం', labelEn: 'Medical' },
    { to: '/police-assistance', labelTe: 'పోలీస్', labelEn: 'Police' },
    { to: '/live', labelTe: 'లైవ్', labelEn: 'Live', isLive: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
      {/* Top Government & Emergency Bar */}
      <div className="bg-gradient-to-r from-godavari-blue-950 via-godavari-blue-900 to-godavari-turquoise-900 text-white text-xs px-4 py-1.5">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-amber-300 font-bold tracking-wide font-telugu">
              {isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'Govt. of Andhra Pradesh'}
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-200 font-medium hidden sm:inline font-telugu">
              {isTe
                ? 'గోదావరి పుష్కరాలు 2027 అధికారిక డిజిటల్ పోర్టల్ (రాజమహేంద్రవరం)'
                : 'Godavari Pushkaralu 2027 Official Digital Portal (Rajamahendravaram)'}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <Link
              to="/police-assistance"
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold transition"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isTe ? 'పోలీస్ / అత్యవసరం: 112' : 'Police / Emergency: 112'}</span>
            </Link>
            <span className="text-slate-500 hidden md:inline">|</span>
            <Link
              to="/medical-assistance"
              className="hidden md:flex items-center gap-1 text-rose-300 hover:text-rose-200 font-semibold transition"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>{isTe ? 'అంబులెన్స్: 108' : 'Ambulance: 108'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header with Separate Left (AP Govt) and Right (Festival Logo) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* ================= LEFT SIDE: Official Andhra Pradesh State Emblem ================= */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-godavari-turquoise-500 rounded-xl p-1"
              title={isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'Government of Andhra Pradesh'}
            >
              {/* User-supplied exact official AP State Emblem */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center p-0.5 transform group-hover:scale-105 transition-transform duration-200 shrink-0">
                <img
                  src="/icons/ap-govt-logo.png"
                  alt="Government of Andhra Pradesh Official Emblem"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>

              {/* Spacious, elegant state government typography */}
              <div className="flex flex-col justify-center">
                <span className="text-sm sm:text-base font-bold text-godavari-blue-950 font-telugu leading-tight">
                  {isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'Government of Andhra Pradesh'}
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-godavari-turquoise-800 uppercase leading-normal">
                  {isTe ? 'దేవాదాయ & ధర్మాదాయ శాఖ' : 'Endowments Department'}
                </span>
                <span className="text-[10px] text-slate-500 hidden md:block">
                  {isTe ? 'రాజమహేంద్రవరం పుష్కరాలు' : 'Rajamahendravaram Pushkaralu'}
                </span>
              </div>
            </Link>
          </div>

          {/* ================= CENTER: Navigation Menu Links ================= */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'text-godavari-blue-900 bg-godavari-blue-50/90 shadow-xs'
                      : 'text-slate-600 hover:text-godavari-blue-900 hover:bg-slate-100/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="flex items-center gap-1.5 font-telugu">
                    {isTe ? link.labelTe : link.labelEn}
                    {link.isLive && (
                      <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded-full animate-pulse">
                        LIVE
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-godavari-blue-700 rounded-full" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ================= RIGHT SIDE: Festival Logo + Title + Language Toggle ================= */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Godavari Pushkaralu Festival Identity Logo (Opposite side) */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-godavari-turquoise-500 rounded-xl p-1"
              title={isTe ? 'గోదావరి పుష్కరాలు 2027' : 'Godavari Pushkaralu 2027'}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-godavari-blue-900 to-godavari-turquoise-600 p-0.5 shadow-md flex items-center justify-center shrink-0 transform group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/icons/logo.svg"
                  alt="Godavari Pushkaralu Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Spacious, uncrowded festival title */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm sm:text-base font-extrabold text-godavari-blue-950 font-telugu leading-tight">
                  {isTe ? 'గోదావరి పుష్కరాలు' : 'Godavari Pushkaralu'}
                </span>
                <span className="text-xs font-black tracking-wider text-amber-600 uppercase">
                  2027
                </span>
              </div>
            </Link>

            {/* Language Switcher (Telugu & English only) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-godavari-turquoise-500/40 bg-godavari-turquoise-50/60 text-godavari-blue-950 hover:bg-godavari-turquoise-100 hover:border-godavari-turquoise-600 transition-colors text-xs sm:text-sm font-bold shadow-xs"
              title={isTe ? 'Switch to English' : 'తెలుగులోకి మార్చండి'}
            >
              <Globe className="w-4 h-4 text-godavari-turquoise-700" />
              <span>{isTe ? 'English' : 'తెలుగు'}</span>
            </button>

            {/* Plan Yatra Quick Action */}
            <Link
              to="/plan-yatra"
              className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-godavari-blue-900 text-white hover:bg-godavari-blue-950 font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition font-telugu"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTe ? 'యాత్ర ప్లానర్' : 'Plan Yatra'}</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-godavari-blue-900 hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium font-telugu transition ${
                    isActive
                      ? 'bg-godavari-blue-50 text-godavari-blue-950 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <span>{isTe ? link.labelTe : link.labelEn}</span>
                {link.isLive && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-rose-600 text-white rounded-full">
                    LIVE
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/plan-yatra"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-godavari-blue-900 text-white font-semibold text-sm shadow font-telugu"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isTe ? 'వ్యక్తిగత యాత్ర ప్లానర్' : 'Personal Yatra Planner'}</span>
            </Link>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link
                to="/medical-assistance"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200 font-telugu"
              >
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>{isTe ? 'వైద్య సహాయం' : 'Medical Aid'}</span>
              </Link>
              <Link
                to="/police-assistance"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200 font-telugu"
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>{isTe ? 'పోలీస్ సహాయం' : 'Police Aid'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
