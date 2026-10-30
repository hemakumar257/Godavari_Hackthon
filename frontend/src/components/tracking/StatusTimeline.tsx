import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { StatusTimelineEvent, ReportStatus } from '../../types/phase3';
import { useLanguage } from '../../hooks/useLanguage';

interface StatusTimelineProps {
  currentStatus: ReportStatus;
  timeline: StatusTimelineEvent[];
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  timeline,
}) => {
  const { isTe } = useLanguage();

  const getStatusIcon = (status: ReportStatus, idx: number, total: number) => {
    if (status === 'resolved' || status === 'closed') {
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
    if (idx === total - 1) {
      return <Clock className="w-5 h-5 text-godavari-blue-600 animate-pulse" />;
    }
    return <ShieldCheck className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative flex items-start gap-4">
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center">
              {getStatusIcon(item.status, idx, timeline.length)}
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-sm">
                  {isTe ? item.statusLabelTe : item.statusLabelEn}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isTe ? item.publicNotesTe : item.publicNotesEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs text-blue-900">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <span>
          {isTe
            ? 'గోప్యతా నిబంధనల ప్రకారం వ్యక్తిగత ఫోన్ నంబర్లు మరియు అంతర్గత పోలీసు నోట్స్‌ను పబ్లిక్ ట్రాకింగ్‌లో చూపించము.'
            : 'Per privacy regulations, private phone numbers and internal investigation notes are excluded from public tracking.'}
        </span>
      </div>
    </div>
  );
};
