import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { HeritageStory } from '../../types/phase5';
import { useLanguage } from '../../hooks/useLanguage';

interface HeritageStoryCardProps {
  story: HeritageStory;
}

export const HeritageStoryCard: React.FC<HeritageStoryCardProps> = ({ story }) => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/heritage/stories/${story.slug}`)}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        <img
          src={story.coverImage}
          alt={isTe ? story.titleTe : story.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-white shadow-xs">
          {isTe ? story.categoryLabelTe : story.categoryLabelEn}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {story.readingTimeMinutes} {isTe ? 'నిమిషాల చదువు' : 'min read'}
            </span>
          </div>
          <h3 className="font-bold text-base sm:text-lg text-godavari-blue-950 group-hover:text-godavari-blue-700 transition font-telugu leading-snug">
            {isTe ? story.titleTe : story.titleEn}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed font-telugu">
            {isTe ? story.introductionTe : story.introductionEn}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-godavari-blue-700 font-telugu">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isTe ? 'పూర్తి కథనం చదవండి' : 'Read Full Story'}</span>
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
