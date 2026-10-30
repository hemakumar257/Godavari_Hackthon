import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { PREVIEW_HERITAGE } from '../../data/mockData';
import { useLanguage } from '../../hooks/useLanguage';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';

export const HeritagePreviewSection: React.FC = () => {
  const { isTe } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          titleTe="గోదావరి చారిత్రక & ఆధ్యాత్మిక వారసత్వం"
          titleEn="Godavari Spiritual & Cultural Heritage"
          subtitleTe="దక్షిణ గంగ పవిత్ర తీరాన వెలసిన ప్రాచీన ఆలయాలు, స్థల పురాణాలు మరియు చారిత్రక సంపద"
          subtitleEn="Ancient temples, mythological origins and historic monuments along sacred River Godavari"
          actionText={isTe ? 'మొత్తం వారసత్వం అన్వేషించండి' : 'Explore All Heritage'}
          actionHref="/heritage"
          isTe={isTe}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREVIEW_HERITAGE.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3">
                  <Badge variant="saffron" size="sm">
                    {isTe ? item.tagTe : item.tagEn}
                  </Badge>
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1.5 text-xs text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-telugu">{isTe ? item.locationTe : item.locationEn}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-godavari-blue-950 font-telugu text-lg mb-2 group-hover:text-godavari-blue-700 transition">
                    {isTe ? item.titleTe : item.titleEn}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-telugu">
                    {isTe ? item.descTe : item.descEn}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-telugu">
                  <span className="text-godavari-turquoise-800 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {isTe ? 'పురాణ విశేషాలు' : 'Mythology & History'}
                  </span>
                  <Link
                    to="/heritage"
                    className="font-bold text-godavari-blue-700 hover:text-godavari-turquoise-600 flex items-center gap-1"
                  >
                    {isTe ? 'వివరాలు' : 'Learn More'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
