import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Sparkles } from 'lucide-react';
import { SuggestedYatraTemplate } from '../../types/phase5';
import { useLanguage } from '../../hooks/useLanguage';

interface SuggestedYatraCardProps {
  template: SuggestedYatraTemplate;
  onUseTemplate?: (template: SuggestedYatraTemplate) => void;
}

export const SuggestedYatraCard: React.FC<SuggestedYatraCardProps> = ({
  template,
  onUseTemplate,
}) => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        <img
          src={template.thumbnailUrl}
          alt={isTe ? template.titleTe : template.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-white shadow-xs font-telugu">
            {isTe ? template.badgeTe : template.badgeEn}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{isTe ? template.durationLabelTe : template.durationLabelEn}</span>
          </div>
          <h3 className="font-bold text-lg font-telugu line-clamp-1">
            {isTe ? template.titleTe : template.titleEn}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-telugu">
            {isTe ? template.descTe : template.descEn}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(isTe ? template.tagsTe : template.tagsEn).map((t, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 font-telugu"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Planned Stops List */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-telugu">
              {isTe ? `ప్రధాన స్థలాలు (${template.totalStops} ఆగడాలు):` : `Major Stops (${template.totalStops} stops):`}
            </div>
            <div className="space-y-1.5">
              {template.stops.slice(0, 3).map((s, idx) => (
                <div key={s.stopId} className="flex items-center gap-2 text-xs text-slate-700 font-telugu">
                  <span className="w-4 h-4 rounded-full bg-godavari-blue-100 text-godavari-blue-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{isTe ? s.nameTe : s.nameEn}</span>
                </div>
              ))}
              {template.stops.length > 3 && (
                <div className="text-[11px] text-slate-400 pl-6 font-telugu">
                  + {template.stops.length - 3} {isTe ? 'మరిన్ని స్థలాలు' : 'more stops'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (onUseTemplate) {
                onUseTemplate(template);
              } else {
                navigate(`/yatra-planner/${template.id}`);
              }
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-godavari-blue-900 hover:bg-godavari-blue-950 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 font-telugu"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isTe ? 'ఈ యాత్రను ఉపయోగించు' : 'Use This Itinerary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
