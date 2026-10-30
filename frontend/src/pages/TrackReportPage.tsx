import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { phase3Api } from '../services/phase3Api';
import { ReportTrackingInfo, ReportStatus } from '../types/phase3';
import { StatusTimeline } from '../components/tracking/StatusTimeline';
import { LoadingState } from '../components/common/LoadingState';
import { DemoBadge } from '../components/common/DemoBadge';
import {
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export const TrackReportPage: React.FC = () => {
  const { isTe } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [trackingIdInput, setTrackingIdInput] = useState(
    searchParams.get('id') || ''
  );
  const [report, setReport] = useState<ReportTrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTracking = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setSearched(true);
    try {
      const data = await phase3Api.getReportTracking(id);
      if (data) {
        setReport(data);
      } else {
        setReport(null);
        setErrorMsg(
          isTe
            ? 'ఈ ఐడీతో ఎలాంటి నివేదిక కనుగొనబడలేదు. దయచేసి సరైన ఐడీని తనిఖీ చేయండి.'
            : 'No record found with this Tracking ID. Please verify your reference number.'
        );
      }
    } catch {
      setErrorMsg(
        isTe ? 'ట్రాకింగ్ సమాచారం పొందడంలో లోపం జరిగింది.' : 'Failed to retrieve tracking status.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryId = searchParams.get('id');
    if (queryId) {
      setTrackingIdInput(queryId);
      fetchTracking(queryId);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingIdInput.trim()) {
      setSearchParams({ id: trackingIdInput.trim() });
      fetchTracking(trackingIdInput.trim());
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isTe ? 'పరిష్కరించబడింది (Resolved)' : 'Resolved / Closed'}</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{isTe ? 'చర్యలో ఉంది (In Progress)' : 'In Progress'}</span>
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isTe ? 'సిబ్బందికి కేటాయించబడింది (Assigned)' : 'Field Assigned'}</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{isTe ? 'పరిశీలనలో ఉంది (Under Review)' : 'Under Review'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{isTe ? 'సమర్పించబడింది (Submitted)' : 'Submitted'}</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isTe ? 'పారదర్శక ప్రజా ట్రాకింగ్ పోర్టల్' : 'Transparent Public Tracking Portal'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isTe ? 'మీ నివేదిక స్థితిని ట్రాక్ చేయండి' : 'Track Your Report Status'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isTe
              ? 'మీరు సమర్పించిన సంఘటన, తప్పిపోయిన వస్తువు లేదా మిస్సింగ్ పర్సన్ రిపోర్ట్ ఐడీని నమోదు చేసి ప్రత్యక్ష పురోగతిని చూడండి.'
              : 'Enter your assigned Tracking Reference ID (e.g., INC-2027-..., LF-2027-..., or MP-2027-...) to view live resolution updates.'}
          </p>
          <div className="pt-2">
            <DemoBadge variant="banner" />
          </div>
        </div>

        {/* Search Bar Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                placeholder={isTe ? 'ట్రాకింగ్ ఐడీ నమోదు చేయండి (ఉదా: INC-2027-104921)' : 'Enter Tracking ID (e.g. INC-2027-104921)'}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-godavari-blue-500/20 focus:border-godavari-blue-500 uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-godavari-blue-600 hover:bg-godavari-blue-700 text-white rounded-2xl text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isTe ? 'ట్రాక్ చేయండి' : 'Check Status'}</span>
            </button>
          </form>

          {/* Quick Demo ID Links */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500">
            <span className="font-semibold">{isTe ? 'నమూనా ఐడీలు (క్లిక్ చేసి పరీక్షించండి):' : 'Demo IDs to test:'}</span>
            {['INC-2027-104921', 'LF-2027-882310', 'MP-2027-401923'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setTrackingIdInput(sample);
                  setSearchParams({ id: sample });
                  fetchTracking(sample);
                }}
                className="px-2.5 py-1 rounded-lg font-mono bg-slate-100 hover:bg-slate-200 text-godavari-blue-700 font-bold transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        {loading ? (
          <LoadingState
            messageTe="నివేదిక వివరాలు పరిశీలిస్తున్నాము..."
            messageEn="Fetching resolution timeline..."
          />
        ) : errorMsg ? (
          <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isTe ? 'సమాచారం కనుగొనబడలేదు' : 'Record Not Found'}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">{errorMsg}</p>
          </div>
        ) : report ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-godavari-blue-700 tracking-wider">
                  {report.reportId}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {report.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{report.submissionDate}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isTe ? report.categoryLabelTe : report.categoryLabelEn}</span>
                  </span>
                </div>
              </div>

              <div>{getStatusBadge(report.currentStatus)}</div>
            </div>

            {/* Public-Safe Official Message */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-950 text-sm">
                  {isTe ? 'అధికారిక తాజా సమాచారం' : 'Latest Official Status Notice'}
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {isTe ? report.publicMessageTe : report.publicMessageEn}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-slate-900 text-base">
                {isTe ? 'పరిష్కార పురోగతి టైమ్‌లైన్' : 'Resolution Progress Timeline'}
              </h3>
              <StatusTimeline
                currentStatus={report.currentStatus}
                timeline={report.statusTimeline}
              />
            </div>
          </div>
        ) : searched ? null : (
          <div className="text-center py-12 text-slate-400 text-sm">
            {isTe
              ? 'నివేదిక స్థితిని చూడటానికి మీ ట్రాకింగ్ ఐడీని పైన నమోదు చేయండి.'
              : 'Enter your tracking ID above to see resolution timeline.'}
          </div>
        )}
      </div>
    </div>
  );
};
