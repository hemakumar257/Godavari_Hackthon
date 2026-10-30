/**
 * HeritageStoryDetailPage – /heritage/stories/:slug
 * Phase 5: Educational and cultural article reader
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  ArrowLeft,
  Share2,
  Check,
  MapPin,
} from 'lucide-react';
import { HeritageStory } from '../types/phase5';
import { phase5Api } from '../services/phase5Api';
import { useLanguage } from '../hooks/useLanguage';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { DemoBadge } from '../components/common/DemoBadge';

export const HeritageStoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isTe } = useLanguage();

  const [story, setStory] = useState<HeritageStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(false);
        const data = await phase5Api.getHeritageStoryBySlug(slug);
        if (data) {
          setStory(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <LoadingState
          messageTe="కథనం లోడ్ అవుతోంది..."
          messageEn="Loading heritage chronicle..."
        />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <ErrorState
          messageTe="కథనం కనుగొనబడలేదు."
          messageEn="Chronicle not found."
          onRetry={() => navigate('/heritage')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation row */}
        <div className="flex items-center justify-between">
          <Link
            to="/heritage"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-godavari-blue-600 transition-colors font-telugu"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTe ? 'వారసత్వ విభాగానికి తిరిగి వెళ్ళు' : 'Back to Heritage'}</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors font-telugu"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? (isTe ? 'కాపీ చేయబడింది' : 'Link Copied') : isTe ? 'షేర్ చేయండి' : 'Share'}</span>
          </button>
        </div>

        {/* Cover Image & Title Header */}
        <article className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="relative aspect-[21/9] sm:aspect-[2.4/1] bg-slate-900">
            <img
              src={story.coverImage}
              alt={isTe ? story.titleTe : story.titleEn}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs font-telugu">
                {isTe ? story.categoryLabelTe : story.categoryLabelEn}
              </span>
              <DemoBadge />
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-3 text-xs text-amber-300 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {story.readingTimeMinutes} {isTe ? 'నిమిషాల పఠనం' : 'min read'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-telugu leading-snug">
                {isTe ? story.titleTe : story.titleEn}
              </h1>
            </div>
          </div>

          {/* Article Text Content */}
          <div className="p-6 sm:p-10 space-y-6">
            {/* Introduction Lead */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-sm sm:text-base font-semibold text-amber-950 font-telugu leading-relaxed">
              {isTe ? story.introductionTe : story.introductionEn}
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed font-telugu">
              {(isTe ? story.contentTe : story.contentEn).map((paragraph, index) => (
                <p key={index} className="leading-loose">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Related Locations Tags */}
            {story.relatedLocations && story.relatedLocations.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-telugu">
                  {isTe ? 'సంబంధిత పవిత్ర స్థలాలు:' : 'Related Holy Locations:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {story.relatedLocations.map((locName, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-godavari-blue-50 text-godavari-blue-800 text-xs font-semibold font-telugu"
                    >
                      <MapPin className="w-3 h-3 text-godavari-blue-600" />
                      {locName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};
