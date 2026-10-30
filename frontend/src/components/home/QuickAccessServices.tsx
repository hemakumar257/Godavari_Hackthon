import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Navigation,
  HeartPulse,
  ShieldAlert,
  Tv,
  Compass,
  MapPin,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { QUICK_SERVICES } from '../../data/mockData';
import { useLanguage } from '../../hooks/useLanguage';
import { SectionHeading } from '../common/SectionHeading';

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  Navigation,
  HeartPulse,
  ShieldAlert,
  Tv,
  Compass,
  MapPin,
  BookOpen,
};

export const QuickAccessServices: React.FC = () => {
  const { isTe } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          titleTe="ముఖ్య సేవలు & సత్వర మార్గదర్శి"
          titleEn="Key Pilgrim Services & Quick Access"
          subtitleTe="పుష్కర యాత్రికుల సౌకర్యార్థం రూపొందించిన ప్రత్యేక డిజిటల్ సేవలు"
          subtitleEn="Essential public services and interactive guides for visiting pilgrims"
          isTe={isTe}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {QUICK_SERVICES.map((service) => {
            const Icon = iconMap[service.iconName] || Compass;

            const isSafety = service.category === 'safety';
            const isPrimary = service.category === 'primary';

            return (
              <Link
                key={service.id}
                to={service.path}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
              >
                {/* Top decorative gradient bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5 ${
                    isSafety
                      ? 'bg-rose-500'
                      : isPrimary
                      ? 'bg-godavari-blue-600'
                      : 'bg-godavari-turquoise-500'
                  }`}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isSafety
                          ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white'
                          : isPrimary
                          ? 'bg-godavari-blue-50 text-godavari-blue-700 group-hover:bg-godavari-blue-800 group-hover:text-white'
                          : 'bg-godavari-turquoise-50 text-godavari-turquoise-700 group-hover:bg-godavari-turquoise-600 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                    </div>

                    {service.badge && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          service.badge === 'Live'
                            ? 'bg-rose-100 text-rose-700 animate-pulse'
                            : service.badge === '24x7'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-godavari-blue-950 mb-2 font-telugu group-hover:text-godavari-blue-700 transition-colors">
                    {isTe ? service.titleTe : service.titleEn}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-telugu">
                    {isTe ? service.descTe : service.descEn}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span
                    className={
                      isSafety
                        ? 'text-rose-600'
                        : isPrimary
                        ? 'text-godavari-blue-700'
                        : 'text-godavari-turquoise-700'
                    }
                  >
                    {isTe ? 'ప్రారంభించండి' : 'Access Service'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-godavari-blue-700 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
