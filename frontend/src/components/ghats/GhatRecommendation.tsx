import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Ghat, Coordinates } from '../../types/phase2';
import { useLanguage } from '../../hooks/useLanguage';
import { NavigateButton } from '../common/NavigateButton';
import { DemoBadge } from '../common/DemoBadge';
import { useNavigate } from 'react-router-dom';

interface GhatRecommendationProps {
  ghats: Ghat[];
  userCoords: Coordinates | null;
  accessibleOnly: boolean;
}

export const GhatRecommendation: React.FC<GhatRecommendationProps> = ({
  ghats,
  userCoords,
  accessibleOnly,
}) => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();

  // Smart Ghat Recommendation Logic:
  // 1. Exclude closed or restricted ghats
  // 2. Filter by accessibility if needed
  // 3. Prioritize lower crowd, then proximity if coords available
  const candidates = ghats.filter((g) => {
    if (g.status !== 'open') return false;
    if (accessibleOnly && !g.isAccessible) return false;
    return true;
  });

  if (candidates.length === 0) return null;

  // Score candidate: low crowd = 30 pts, moderate = 15, low distance = more pts
  const scored = candidates.map((g) => {
    let score = 0;
    const reasonsTe: string[] = [];
    const reasonsEn: string[] = [];

    if (g.status === 'open') {
      score += 20;
      reasonsTe.push('ప్రస్తుతం తెరిచి ఉంది');
      reasonsEn.push('Currently open & functioning');
    }

    if (g.crowdStatus === 'low') {
      score += 40;
      reasonsTe.push('తక్కువ రద్దీ నివేదించబడింది');
      reasonsEn.push('Low reported crowd level');
    } else if (g.crowdStatus === 'moderate') {
      score += 20;
      reasonsTe.push('నియంత్రిత రద్దీ');
      reasonsEn.push('Moderate crowd management');
    }

    if (g.isAccessible) {
      score += 15;
      reasonsTe.push('దివ్యాంగులు & వృద్ధులకు అనువైన సదుపాయాలు');
      reasonsEn.push('Accessible for elderly & differently-abled');
    }

    if (g.hasMedicalCamp) {
      score += 10;
      reasonsTe.push('వైద్య శిబిరం మరియు ప్రథమ చికిత్స అందుబాటులో ఉంది');
      reasonsEn.push('Medical camp & first aid available on-site');
    }

    if (g.distanceKm !== undefined) {
      // Lower distance gets bonus
      const distBonus = Math.max(0, 30 - g.distanceKm * 5);
      score += distBonus;
      reasonsTe.push(`మీ స్థానానికి కేవలం ${g.distanceKm} కి.మీ సమీపంలో ఉంది`);
      reasonsEn.push(`Only ${g.distanceKm} km from your current location`);
    }

    return { ghat: g, score, reasonsTe, reasonsEn };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  return (
    <div className="bg-gradient-to-br from-godavari-blue-900 via-godavari-blue-800 to-godavari-blue-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-godavari-blue-700 relative overflow-hidden my-6">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-godavari-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-godavari-gold-500/20 text-godavari-gold-400 border border-godavari-gold-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-white">
                {isTe ? 'స్మార్ట్ ఘాట్ సిఫార్సు' : 'Smart Ghat Recommendation'}
              </h3>
              <p className="text-xs text-godavari-blue-200">
                {isTe
                  ? 'రద్దీ, సౌకర్యాలు మరియు దూరం ఆధారంగా మీకు అనువైన ఘాట్'
                  : 'Best suited ghat based on live density, amenities & distance'}
              </p>
            </div>
          </div>
          <DemoBadge className="bg-amber-400/20 text-amber-300 border-amber-400/40" />
        </div>

        {/* Selected Ghat Box */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl font-bold text-white">
                {isTe ? best.ghat.nameTe : best.ghat.nameEn}
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                ✓ {isTe ? 'అత్యుత్తమ ఎంపిక' : 'Top Recommendation'}
              </span>
            </div>

            <p className="text-xs text-slate-200 line-clamp-2">
              {isTe ? best.ghat.descTe : best.ghat.descEn}
            </p>

            {/* Why Recommended bullets */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold text-godavari-gold-300 uppercase tracking-wider">
                {isTe ? 'ఎందుకు సిఫార్సు చేయబడింది:' : 'Why this ghat is recommended:'}
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-200">
                {(isTe ? best.reasonsTe : best.reasonsEn).slice(0, 4).map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action side */}
          <div className="flex flex-col gap-2.5 justify-center md:border-l md:border-white/10 md:pl-5">
            <NavigateButton
              coordinates={best.ghat.coordinates}
              userCoords={userCoords}
              className="w-full justify-center bg-godavari-gold-500 hover:bg-godavari-gold-600 text-slate-950 font-bold"
              size="md"
            />
            <button
              type="button"
              onClick={() => navigate(`/explore/${best.ghat.id}`)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{isTe ? 'పూర్తి ఘాట్ వివరాలు' : 'View Ghat Details'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-3 flex items-start gap-2 text-[11px] text-godavari-blue-300/80">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            {isTe
              ? 'గమనిక: ఈ సిఫార్సు కేవలం అందుబాటులో ఉన్న నమూనా సమాచారంపై ఆధారపడి ఉంటుంది. నదీ ప్రవాహం మరియు అధికారుల ప్రత్యక్ష సూచనలను తప్పక పాటించండి.'
              : 'Disclaimer: This recommendation is generated using demonstration parameters. Always heed safety signs and official river police directives at the ghat.'}
          </span>
        </div>
      </div>
    </div>
  );
};
