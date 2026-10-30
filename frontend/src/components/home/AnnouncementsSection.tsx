import React from 'react';
import { Bell, AlertTriangle, Info, Calendar } from 'lucide-react';
import { PREVIEW_ANNOUNCEMENTS } from '../../data/mockData';
import { useLanguage } from '../../hooks/useLanguage';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';

export const AnnouncementsSection: React.FC = () => {
  const { isTe } = useLanguage();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'important':
        return <Bell className="w-5 h-5 text-amber-600" />;
      default:
        return <Info className="w-5 h-5 text-godavari-turquoise-600" />;
    }
  };

  const getBorderColor = (severity: string) => {
    switch (severity) {
      case 'alert':
        return 'border-l-rose-500 bg-rose-50/30';
      case 'important':
        return 'border-l-amber-500 bg-amber-50/30';
      default:
        return 'border-l-godavari-turquoise-500 bg-godavari-turquoise-50/20';
    }
  };

  return (
    <section id="announcements" className="py-12 sm:py-16 bg-white scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          titleTe="ముఖ్య ప్రకటనలు & మార్గదర్శకాలు"
          titleEn="Important Official Announcements & Advisories"
          subtitleTe="యాత్రికుల క్షేమం మరియు సౌలభ్యం కోసం ఆంధ్రప్రదేశ్ ప్రభుత్వం విడుదల చేసిన తాజా సమాచారం"
          subtitleEn="Advisories and procedural guidelines for visiting pilgrims issued by Govt of AP (Demonstration Content)"
          isTe={isTe}
        />

        <div className="space-y-4 max-w-4xl mx-auto">
          {PREVIEW_ANNOUNCEMENTS.map((ann) => (
            <div
              key={ann.id}
              className={`rounded-xl border border-slate-200 border-l-4 p-5 sm:p-6 transition-all hover:shadow-subtle ${getBorderColor(
                ann.severity
              )}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  {getSeverityIcon(ann.severity)}
                  <h4 className="font-bold text-godavari-blue-950 font-telugu text-base sm:text-lg">
                    {isTe ? ann.titleTe : ann.titleEn}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="demo" size="sm">
                    Notice
                  </Badge>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-sans">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.date}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7 sm:pl-7 font-telugu">
                {isTe ? ann.descTe : ann.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
