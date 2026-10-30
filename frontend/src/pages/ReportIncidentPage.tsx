import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { phase3Api } from '../services/phase3Api';
import { IncidentCategory, IncidentReportData } from '../types/phase3';
import { useGeolocation } from '../hooks/useGeolocation';
import { DemoBadge } from '../components/common/DemoBadge';
import {
  AlertTriangle,
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Users,
  Eye,
  Wrench,
  Trash2,
  HelpCircle,
  Activity,
} from 'lucide-react';

export const ReportIncidentPage: React.FC = () => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();
  const { location: userCoords, requestLocation, loading: geoLoading } = useGeolocation();

  const [category, setCategory] = useState<IncidentCategory>('crowd_issue');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [incidentDateTime, setIncidentDateTime] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    reportId: string;
    message: string;
  } | null>(null);

  const categoryOptions: { key: IncidentCategory; labelTe: string; labelEn: string; icon: React.ReactNode }[] = [
    { key: 'medical_emergency', labelTe: 'వైద్య అత్యవసరం', labelEn: 'Medical Emergency', icon: <Activity className="w-4 h-4 text-rose-600" /> },
    { key: 'crowd_issue', labelTe: 'రద్దీ / తొక్కిసలాట సమస్య', labelEn: 'Crowd Bottleneck', icon: <Users className="w-4 h-4 text-amber-600" /> },
    { key: 'suspicious_activity', labelTe: 'అనుమానాస్పద వ్యక్తి / వస్తువు', labelEn: 'Suspicious Activity', icon: <Eye className="w-4 h-4 text-purple-600" /> },
    { key: 'infrastructure_hazard', labelTe: 'బారికేడ్ / విద్యుత్ ప్రమాదం', labelEn: 'Infrastructure Hazard', icon: <Wrench className="w-4 h-4 text-red-600" /> },
    { key: 'sanitation_issue', labelTe: 'పారిశుద్ధ్యం / చెత్త సమస్య', labelEn: 'Sanitation / Overflow', icon: <Trash2 className="w-4 h-4 text-emerald-600" /> },
    { key: 'lost_person', labelTe: 'తప్పిపోయిన వ్యక్తి సహాయం', labelEn: 'Lost Person Assistance', icon: <ShieldAlert className="w-4 h-4 text-indigo-600" /> },
    { key: 'lost_and_found', labelTe: 'వస్తువుల కోల్పోవడం', labelEn: 'Lost & Found Issue', icon: <HelpCircle className="w-4 h-4 text-blue-600" /> },
    { key: 'general_assistance', labelTe: 'సాధారణ సహాయం', labelEn: 'General Public Assistance', icon: <HelpCircle className="w-4 h-4 text-slate-600" /> },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setImageError(isTe ? 'కేవలం JPG, PNG, లేదా WEBP ఫార్మాట్లు మాత్రమే చెల్లుతాయి.' : 'Only JPG, PNG, or WEBP images are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError(isTe ? 'చిత్రం పరిమాణం 2MB లోపు ఉండాలి.' : 'File size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImageFile(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title || !description || !locationName || !reporterName || !reporterPhone) {
      setFormError(isTe ? 'దయచేసి అన్ని అవసరమైన వివరాలను పూరించండి.' : 'Please fill all mandatory fields marked with *.');
      return;
    }

    if (reporterPhone.length < 10) {
      setFormError(isTe ? 'చెల్లుబాటు అయ్యే 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!consentChecked) {
      setFormError(isTe ? 'దయచేసి గోప్యతా మరియు ధృవీకరణ నిబంధనను అంగీకరించండి.' : 'Please agree to the verification notice before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: IncidentReportData = {
        category,
        title,
        description,
        locationName,
        coordinates: userCoords ? { lat: userCoords.lat, lng: userCoords.lng } : undefined,
        incidentDateTime: incidentDateTime || new Date().toISOString(),
        reporterName,
        reporterPhone,
        reporterEmail,
        imageBase64: imageFile || undefined,
      };

      const res = await phase3Api.submitIncidentReport(payload);
      setSubmissionSuccess({
        reportId: res.reportId,
        message: res.message,
      });
    } catch {
      setFormError(isTe ? 'రిపోర్ట్ సమర్పణలో లోపం ఏర్పడింది.' : 'Failed to submit incident report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{isTe ? 'ప్రజా సమస్యల పరిష్కార విభాగం' : 'Public Incident Reporting Portal'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isTe ? 'సమస్యను నివేదించండి (Report an Issue)' : 'Report a Safety or Public Issue'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isTe
              ? 'ఘాట్‌ల వద్ద రద్దీ, పారిశుద్ధ్య లోపాలు, విద్యుత్ సమస్యలు లేదా భద్రతా అంతరాయాలను అధికారిక నియంత్రణ కేంద్రానికి తెలియజేయండి.'
              : 'Directly alert festival coordination teams and quick-response units regarding safety hazards, bottlenecks, or sanitation issues.'}
          </p>
          <div className="pt-2">
            <DemoBadge variant="banner" />
          </div>
        </div>

        {/* Life-threatening emergency alert */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-rose-900">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              <strong>{isTe ? 'అత్యవసర ప్రాణాపాయ పరిస్థితినా?' : 'Critical Medical or Law Emergency?'}</strong>{' '}
              {isTe ? 'ఆన్‌లైన్ ఫారమ్‌కు బదులుగా వెంటనే 108 లేదా 100 కు కాల్ చేయండి.' : 'Please do not wait for a form response. Call 108 or 100 immediately.'}
            </span>
          </div>
          <a
            href="tel:112"
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shrink-0 shadow-xs"
          >
            112
          </a>
        </div>

        {/* Success Modal */}
        {submissionSuccess ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-md text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">
                {isTe ? 'సమస్య నమోదు చేయబడింది!' : 'Incident Report Registered!'}
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {isTe
                  ? 'మీ నివేదిక పుష్కరాల నియంత్రణ కేంద్రానికి చేరింది. సిబ్బంది పరిశీలించి తగిన చర్యలు తీసుకుంటారు.'
                  : 'Your report has been dispatched to festival field units. You can track progress anytime with your Tracking ID.'}
              </p>
            </div>

            <div className="bg-slate-50 border-2 border-dashed border-godavari-blue-300 rounded-2xl p-5 max-w-md mx-auto">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                {isTe ? 'మీ సంఘటన ట్రాకింగ్ ఐడీ' : 'Your Incident Tracking ID'}
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-godavari-blue-900 tracking-wider">
                {submissionSuccess.reportId}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate(`/track-report?id=${submissionSuccess.reportId}`)}
                className="w-full sm:w-auto px-6 py-3 bg-godavari-blue-600 hover:bg-godavari-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>{isTe ? 'స్టేటస్ ట్రాక్ చేయండి' : 'Track Status'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmissionSuccess(null);
                  setTitle('');
                  setDescription('');
                  setLocationName('');
                  setImageFile(null);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                {isTe ? 'మరో సమస్యను నివేదించండి' : 'Report Another Issue'}
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {isTe ? 'సమస్య విభాగం *' : 'Incident Category *'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setCategory(opt.key)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                      category === opt.key
                        ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs ring-2 ring-amber-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {opt.icon}
                    <span className="line-clamp-2 leading-tight">{isTe ? opt.labelTe : opt.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isTe ? 'సమస్య శీర్షిక *' : 'Short Title / Summary *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isTe ? 'ఉదా: పుష్కర ఘాట్ 2వ గేటు వద్ద తీవ్రమైన రద్దీ' : 'e.g. Broken barricade rail near Pushkar Ghat gate 2'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isTe ? 'వివరణ & సమస్య తీవ్రత *' : 'Detailed Description *'}
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isTe ? 'సమస్య ఎక్కడ ఉంది, పరిస్థితి ఏమిటి, వెంటనే చేయవలసినది...' : 'Please specify exact landmarks, estimated number of persons impacted, or nature of risk...'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Location & GPS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isTe ? 'ప్రదేశం / చిరునామా *' : 'Location / Ghat Landmark *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder={isTe ? 'ఉదా: కోటిలింగాల ఘాట్ వాటర్ పైప్ దగ్గర' : 'e.g. Pushkar Ghat Lane 3 water kiosk'}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={requestLocation}
                    disabled={geoLoading}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-godavari-blue-600 hover:text-godavari-blue-800"
                    title={isTe ? 'GPS లొకేషన్ జోడించండి' : 'Attach GPS coordinates'}
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
                {userCoords && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    GPS: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isTe ? 'సంఘటన సమయం' : 'Incident Date & Time'}
                </label>
                <input
                  type="datetime-local"
                  value={incidentDateTime}
                  onChange={(e) => setIncidentDateTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-700"
                />
              </div>
            </div>

            {/* Optional Photo Attachment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isTe ? 'ఫోటో జతచేయండి (ఐచ్ఛికం, గరిష్టంగా 2MB)' : 'Attach Photograph (Optional, Max 2MB)'}
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-amber-400 transition-colors">
                {imageFile ? (
                  <div className="space-y-2">
                    <img
                      src={imageFile}
                      alt="Incident preview"
                      className="w-24 h-24 object-cover mx-auto rounded-lg shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      {isTe ? 'ఫోటో తొలగించండి' : 'Remove Photo'}
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-1">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <span className="text-xs font-semibold text-amber-700 block">
                      {isTe ? 'సంఘటన ప్రదేశం ఫోటో ఎంచుకోండి (JPG, PNG)' : 'Upload scene photo (JPG, PNG)'}
                    </span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {imageError && <p className="text-xs text-rose-600 mt-1">{imageError}</p>}
            </div>

            {/* Reporter details */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {isTe ? 'నివేదకుడి వివరాలు (అధికారుల పరిశీలన కొరకు)' : 'Reporter Information (For Official Verification)'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTe ? 'మీ పేరు *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTe ? 'మొబైల్ నంబర్ *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="10-digit phone number"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isTe ? 'ఈమెయిల్ (ఐచ్ఛికం)' : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="yourname@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Consent checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  required
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-600 leading-snug">
                  {isTe
                    ? 'నేను ఇచ్చిన సమాచారం నిజమైనదని ధృవీకరిస్తున్నాను. అత్యవసర సహాయం కొరకు పుష్కరాల నియంత్రణ అధికారులు నన్ను సంప్రదించడానికి సమ్మతిస్తున్నాను.'
                    : 'I declare the provided information is true to the best of my knowledge and authorize festival control teams to contact me if needed.'}
                </span>
              </label>
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-xs transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isTe ? 'సమస్యను నివేదించండి' : 'Submit Incident Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
