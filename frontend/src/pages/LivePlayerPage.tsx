import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Film } from 'lucide-react';
import { LiveStream } from '../types/phase4';
import { phase4Api } from '../services/phase4Api';
import { VideoPlayer } from '../components/live/VideoPlayer';
import { StreamCard } from '../components/live/StreamCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { useLanguage } from '../hooks/useLanguage';

export const LivePlayerPage: React.FC = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const navigate = useNavigate();
  const { isTe } = useLanguage();

  const [stream, setStream] = useState<LiveStream | null>(null);
  const [allStreams, setAllStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStream = async () => {
      if (!streamId) return;
      setLoading(true);
      setError(false);
      try {
        const [target, list] = await Promise.all([
          phase4Api.getLiveStreamById(streamId),
          phase4Api.getLiveStreams(),
        ]);
        if (target) {
          setStream(target);
        } else {
          setError(true);
        }
        setAllStreams(list);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [streamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 py-16">
        <LoadingState
          messageTe="ప్రత్యక్ష ప్రసార ప్లేయర్ సిద్ధమవుతోంది..."
          messageEn="Loading streaming player..."
        />
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <ErrorState
          messageTe="ఈ ప్రసారం కనుగొనబడలేదు."
          messageEn="Live stream not found or currently unavailable."
          onRetry={() => navigate('/live')}
        />
      </div>
    );
  }

  const relatedStreams = allStreams
    .filter((s) => s.id !== stream.id && (s.category === stream.category || s.status === 'LIVE'))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/live')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTe ? 'అన్ని ప్రసారాలు (Live Hub)' : 'Back to Live Hub'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/live/recordings')}
            className="text-xs font-semibold text-slate-500 hover:text-godavari-blue-700 flex items-center gap-1"
          >
            <Film className="w-3.5 h-3.5" />
            <span>{isTe ? 'రికార్డింగ్‌లు' : 'Recordings'}</span>
          </button>
        </div>

        {/* Main Grid: Player + Related */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video & Details column */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer stream={stream} />
          </div>

          {/* Related Live Feeds sidebar */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 text-lg">
              {isTe ? 'సంబంధిత ఇతర ప్రసారాలు' : 'Related Live Broadcasts'}
            </h3>

            {relatedStreams.length === 0 ? (
              <p className="text-xs text-slate-400">
                {isTe ? 'ఇతర ప్రసారాలు లేవు.' : 'No other streams in this category.'}
              </p>
            ) : (
              <div className="space-y-4">
                {relatedStreams.map((rel) => (
                  <StreamCard key={rel.id} stream={rel} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
