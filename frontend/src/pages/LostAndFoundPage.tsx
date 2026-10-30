import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { phase3Api } from '../services/phase3Api';
import { LostFoundCategory, LostItemReportData, MissingPersonReportData } from '../types/phase3';
import { DemoBadge } from '../components/common/DemoBadge';
import {
  FileQuestion,
  UserCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
  Phone,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Smartphone,
  Wallet,
  Briefcase,
  Gem,
  FileText,
  Shirt,
  HelpCircle,
} from 'lucide-react';

export const LostAndFoundPage: React.FC = () => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active form tab: 'lost' | 'found' | 'missing'
  const initialTab = searchParams.get('tab') === 'missing' ? 'missing' : 'lost';
  const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'missing'>(initialTab);

  // Form states - Lost/Found
  const [itemType, setItemType] = useState<'lost' | 'found'>('lost');
  const [category, setCategory] = useState<LostFoundCategory>('mobile');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [approxDateTime, setApproxDateTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Form states - Missing Person
  const [personName, setPersonName] = useState('');
  const [ageRange, setAgeRange] = useState('Child (0-12 yrs)');
  const [gender, setGender] = useState('Male');
  const [personDesc, setPersonDesc] = useState('');
  const [clothingDesc, setClothingDesc] = useState('');
  const [lastLocation, setLastLocation] = useState('');
  const [missingDateTime, setMissingDateTime] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterRelation, setReporterRelation] = useState('Family / Relative');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    reportId: string;
    message: string;
    type: 'lost' | 'found' | 'missing';
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Categories helper
  const categoryOptions: { key: LostFoundCategory; labelTe: string; labelEn: string; icon: React.ReactNode }[] = [
    { key: 'mobile', labelTe: 'మొబైల్ ఫోన్', labelEn: 'Mobile Phone', icon: <Smartphone className="w-4 h-4" /> },
    { key: 'wallet', labelTe: 'వాలెట్ / పర్సు', labelEn: 'Wallet / Purse', icon: <Wallet className="w-4 h-4" /> },
    { key: 'bag', labelTe: 'బ్యాగ్ / లగేజ్', labelEn: 'Bag / Backpack', icon: <Briefcase className="w-4 h-4" /> },
    { key: 'jewellery', labelTe: 'ఆభరణాలు / బంగారం', labelEn: 'Jewellery / Ornaments', icon: <Gem className="w-4 h-4" /> },
    { key: 'documents', labelTe: 'గుర్తింపు కార్డులు / డాక్యుమెంట్లు', labelEn: 'Documents / ID Cards', icon: <FileText className="w-4 h-4" /> },
    { key: 'clothing', labelTe: 'వస్త్రాలు', labelEn: 'Clothing', icon: <Shirt className="w-4 h-4" /> },
    { key: 'other', labelTe: 'ఇతర వస్తువులు', labelEn: 'Other Belongings', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  // Image Upload handler with strict file size (<2MB) and type restrictions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageError(isTe ? 'కేవలం JPG, PNG, లేదా WEBP ఫార్మాట్లు మాత్రమే అనుమతించబడతాయి.' : 'Only JPG, PNG, or WEBP image formats are supported.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError(isTe ? 'చిత్రం పరిమాణం 2MB కంటే తక్కువగా ఉండాలి.' : 'Image size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit Lost/Found
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!itemName || !description || !locationName || !contactName || !contactPhone) {
      setFormError(isTe ? 'దయచేసి అన్ని అవసరమైన వివరాలను నమోదు చేయండి.' : 'Please fill in all mandatory fields marked with *.');
      return;
    }

    if (contactPhone.length < 10) {
      setFormError(isTe ? 'దయచేసి చెల్లుబాటు అయ్యే 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి.' : 'Please enter a valid 10-digit phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: LostItemReportData = {
        type: itemType,
        category,
        itemName,
        description,
        approximateDateTime: approxDateTime || new Date().toISOString(),
        locationName,
        contactName,
        contactPhone,
        contactEmail,
        imageBase64: imageFile || undefined,
      };

      const result = await phase3Api.submitLostFoundReport(payload);
      setSubmissionSuccess({
        reportId: result.reportId,
        message: result.message,
        type: itemType,
      });
    } catch {
      setFormError(isTe ? 'రిపోర్ట్ సమర్పించడంలో లోపం ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి.' : 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Missing Person
  const handleMissingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!personName || !clothingDesc || !lastLocation || !reporterName || !reporterPhone) {
      setFormError(isTe ? 'దయచేసి తప్పిపోయిన వ్యక్తి వివరాలు మరియు మీ సంప్రదింపు సమాచారాన్ని నమోదు చేయండి.' : 'Please fill in missing person details and your contact details.');
      return;
    }

    if (reporterPhone.length < 10) {
      setFormError(isTe ? 'దయచేసి చెల్లుబాటు అయ్యే 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: MissingPersonReportData = {
        personName,
        ageRange,
        gender,
        description: personDesc,
        clothingDescription: clothingDesc,
        lastKnownLocation: lastLocation,
        approximateDateTime: missingDateTime || new Date().toISOString(),
        reporterName,
        reporterPhone,
        reporterRelation,
        imageBase64: imageFile || undefined,
      };

      const result = await phase3Api.submitMissingPersonReport(payload);
      setSubmissionSuccess({
        reportId: result.reportId,
        message: result.message,
        type: 'missing',
      });
    } catch {
      setFormError(isTe ? 'సమర్పించడంలో లోపం జరిగింది.' : 'Failed to submit alert.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
            <FileQuestion className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isTe ? 'తప్పిపోయిన & దొరికిన సహాయ విభాగం' : 'Lost & Found Coordination Registry'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isTe ? 'తప్పిపోయిన వస్తువులు & వ్యక్తుల నమోదు' : 'Lost & Found / Missing Persons'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isTe
              ? 'పోగొట్టుకున్న వస్తువులను వెతకడానికి లేదా దొరికిన వస్తువులను సురక్షితంగా అప్పగించడానికి డిజిటల్ రిజిస్ట్రేషన్ పోర్టల్.'
              : 'Digital registration and tracking portal to report misplaced belongings or file emergency missing person alerts.'}
          </p>
          <div className="pt-2">
            <DemoBadge variant="banner" />
          </div>
        </div>

        {/* Urgent Police Notice for Missing Persons */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-rose-950 text-sm sm:text-base">
                {isTe ? 'తప్పిపోయిన వ్యక్తుల అత్యవసర హెచ్చరిక' : 'Urgent Missing Person Emergency Advisory'}
              </h3>
              <p className="text-xs text-rose-800 leading-relaxed mt-0.5">
                {isTe
                  ? 'చిన్న పిల్లలు లేదా వృద్ధులు తప్పిపోయిన సందర్భంలో తక్షణమే సమీప పోలీస్ సహాయ కేంద్రానికి లేదా 100/112 కు కాల్ చేయండి.'
                  : 'If a child or vulnerable elder is separated, immediately approach the nearest police help desk or dial 100 / 112.'}
              </p>
            </div>
          </div>
          <a
            href="tel:100"
            className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{isTe ? 'పోలీస్: 100' : 'Police: 100'}</span>
          </a>
        </div>

        {/* Success Modal / Card */}
        {submissionSuccess ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-md text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">
                {isTe ? 'నివేదిక విజయవంతంగా నమోదైంది!' : 'Report Successfully Registered!'}
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {isTe
                  ? 'మీ నివేదికకు ప్రత్యేక ట్రాకింగ్ ఐడీ కేటాయించబడింది. దీని ద్వారా మీరు నివేదిక పురోగతిని తెలుసుకోవచ్చు.'
                  : 'Your record has been logged in the secure pushkaralu registry with a unique tracking code.'}
              </p>
            </div>

            {/* Generated Tracking ID Box */}
            <div className="bg-slate-50 border-2 border-dashed border-godavari-blue-300 rounded-2xl p-5 max-w-md mx-auto">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                {isTe ? 'మీ డిజిటల్ ట్రాకింగ్ ఐడీ' : 'Your Digital Tracking ID'}
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-godavari-blue-900 tracking-wider">
                {submissionSuccess.reportId}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {isTe ? 'దయచేసి ఈ ఐడీని సురక్షితంగా సేవ్ చేసుకోండి.' : 'Please screenshot or note this tracking reference ID.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate(`/track-report?id=${submissionSuccess.reportId}`)}
                className="w-full sm:w-auto px-6 py-3 bg-godavari-blue-600 hover:bg-godavari-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>{isTe ? 'స్టేటస్ ట్రాక్ చేయండి' : 'Track Status Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmissionSuccess(null);
                  setImageFile(null);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                {isTe ? 'మరో రిపోర్ట్ నమోదు చేయండి' : 'File Another Report'}
              </button>
            </div>
          </div>
        ) : (
          /* Form Tabs */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="grid grid-cols-3 border-b border-slate-200 text-center font-bold text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('lost');
                  setItemType('lost');
                }}
                className={`py-4 px-2 transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'lost'
                    ? 'border-b-2 border-rose-600 text-rose-700 bg-rose-50/50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileQuestion className="w-4 h-4" />
                <span>{isTe ? 'పోగొట్టుకున్న వస్తువు' : 'Report Lost Item'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('found');
                  setItemType('found');
                }}
                className={`py-4 px-2 transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'found'
                    ? 'border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50/50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isTe ? 'దొరికిన వస్తువు' : 'Report Found Item'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('missing')}
                className={`py-4 px-2 transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'missing'
                    ? 'border-b-2 border-amber-600 text-amber-800 bg-amber-50/50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{isTe ? 'తప్పిపోయిన వ్యక్తి' : 'Missing Person'}</span>
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="m-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* FORM A & B: Lost or Found Item */}
            {(activeTab === 'lost' || activeTab === 'found') && (
              <form onSubmit={handleItemSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>
                      {activeTab === 'lost'
                        ? isTe
                          ? '1. పోగొట్టుకున్న వస్తువు వివరాలు'
                          : '1. Lost Item Details'
                        : isTe
                        ? '1. దొరికిన వస్తువు వివరాలు'
                        : '1. Found Item Details'}
                    </span>
                  </h3>

                  {/* Category Pills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      {isTe ? 'వస్తువు వర్గం *' : 'Item Category *'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {categoryOptions.map((c) => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => setCategory(c.key)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                            category === c.key
                              ? 'border-godavari-blue-600 bg-godavari-blue-50 text-godavari-blue-900 shadow-xs'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {c.icon}
                          <span className="truncate">{isTe ? c.labelTe : c.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Item Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isTe ? 'వస్తువు పేరు / శీర్షిక *' : 'Item Name / Brand *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder={isTe ? 'ఉదా: శామ్‌సంగ్ గెలాక్సీ మొబైల్ లేదా నల్లటి లెదర్ పర్సు' : 'e.g. Samsung Galaxy S21 in blue cover or Black leather wallet'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-godavari-blue-500/20 focus:border-godavari-blue-500"
                    />
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isTe ? 'వివరణ & ప్రత్యేక గుర్తులు *' : 'Description & Distinguishing Marks *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={isTe ? 'రంగు, బ్రాండ్, గుర్తులు, లేదా లోపల ఉన్న ప్రత్యేక వస్తువుల వివరాలు...' : 'Color, scratches, distinctive tags, or contents (for verification purposes)...'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-godavari-blue-500/20 focus:border-godavari-blue-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isTe
                        ? 'భద్రతా కారణాల దృష్ట్యా సున్నితమైన బ్యాంక్ వివరాలు రాయవద్దు.'
                        : 'Do not disclose exact PINs or secret credentials to prevent fraudulent claims.'}
                    </p>
                  </div>

                  {/* Location & Time Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {activeTab === 'lost'
                          ? isTe
                            ? 'పోగొట్టుకున్న ప్రదేశం *'
                            : 'Approximate Location Lost *'
                          : isTe
                          ? 'దొరికిన ప్రదేశం *'
                          : 'Location Found *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        placeholder={isTe ? 'ఉదా: పుష్కర ఘాట్ 3వ మెట్టు వద్ద' : 'e.g. Near Pushkar Ghat stairs lane 2'}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-godavari-blue-500/20 focus:border-godavari-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isTe ? 'సుమారు తేదీ & సమయం' : 'Approximate Date & Time'}
                      </label>
                      <input
                        type="datetime-local"
                        value={approxDateTime}
                        onChange={(e) => setApproxDateTime(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-godavari-blue-500/20 focus:border-godavari-blue-500 text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isTe ? 'వస్తువు ఫోటో (ఐచ్ఛికం, గరిష్టంగా 2MB)' : 'Optional Photograph (Max 2MB)'}
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-godavari-blue-400 transition-colors">
                      {imageFile ? (
                        <div className="space-y-2">
                          <img
                            src={imageFile}
                            alt="Uploaded preview"
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
                          <span className="text-xs font-semibold text-godavari-blue-600 block">
                            {isTe ? 'ఫోటోను ఎంచుకోండి (JPG, PNG)' : 'Click to upload image (JPG, PNG)'}
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
                </div>

                {/* Section 2: Contact Information */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">
                      {isTe ? '2. మీ సంప్రదింపు సమాచారం' : '2. Your Contact Information'}
                    </h3>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                      🔒 {isTe ? 'గోప్యంగా ఉంచబడుతుంది' : 'Privacy Protected'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isTe ? 'మీ పూర్తి పేరు *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={isTe ? 'ఉదా: రమేష్ బాబు' : 'e.g. Ramesh Babu'}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-godavari-blue-500/20 focus:border-godavari-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isTe ? 'మొబైల్ నంబర్ *' : 'Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-godavari-blue-500/20 focus:border-godavari-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isTe ? 'ఈమెయిల్ (ఐచ్ఛికం)' : 'Email (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-godavari-blue-500/20 focus:border-godavari-blue-500"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                  <p className="text-[11px] text-slate-500">
                    {isTe
                      ? 'ఈ వివరాలు కేవలం పుష్కరాల అధికారులు మరియు సరిపోల్చే ప్రక్రియకు మాత్రమే వాడబడతాయి.'
                      : 'Data strictly utilized for matching claims by authorized desk personnel.'}
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-godavari-blue-600 hover:bg-godavari-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isTe ? 'నివేదిక సమర్పించండి' : 'Submit Report'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* FORM C: Missing Person Assistance */}
            {activeTab === 'missing' && (
              <form onSubmit={handleMissingSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">
                      {isTe ? 'తప్పిపోయిన వ్యక్తి వివరాలు' : 'Missing Person Particulars'}
                    </h3>
                    <span className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                      🚨 High Priority Desk
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isTe ? 'వ్యక్తి పేరు *' : 'Person Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                        placeholder={isTe ? 'పేరు (తెలిస్తే)' : 'Full Name'}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isTe ? 'వయో పరిమితి *' : 'Age Range *'}
                      </label>
                      <select
                        value={ageRange}
                        onChange={(e) => setAgeRange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                      >
                        <option value="Child (0-12 yrs)">Child (0-12 yrs)</option>
                        <option value="Teenager (13-19 yrs)">Teenager (13-19 yrs)</option>
                        <option value="Adult (20-59 yrs)">Adult (20-59 yrs)</option>
                        <option value="Senior Citizen (60+ yrs)">Senior Citizen (60+ yrs)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isTe ? 'లింగం *' : 'Gender *'}
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isTe ? 'ధరించిన దుస్తుల వివరాలు *' : 'Clothing Description *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={clothingDesc}
                      onChange={(e) => setClothingDesc(e.target.value)}
                      placeholder={isTe ? 'ఉదా: తెలుపు కుర్తా, నీలం రంగు చీర, లేదా చారల చొక్కా...' : 'e.g. White khadi shirt with brown dhoti, or blue cotton saree...'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isTe ? 'శారీరక లక్షణాలు & వివరణ' : 'Physical Appearance & Details'}
                    </label>
                    <textarea
                      rows={2}
                      value={personDesc}
                      onChange={(e) => setPersonDesc(e.target.value)}
                      placeholder={isTe ? 'ఎత్తు, భాష, అద్దాలు ధరించారా, ఏదైనా ప్రత్యేక గుర్తులు...' : 'Height, spoken languages, spectacles, medical condition if any...'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isTe ? 'చివరిసారి చూసిన ప్రదేశం *' : 'Last Seen Location *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={lastLocation}
                        onChange={(e) => setLastLocation(e.target.value)}
                        placeholder={isTe ? 'ఉదా: కోటిలింగాల ఘాట్ ప్రవేశ ద్వారం వద్ద' : 'e.g. Near Kotilingala Ghat entry'}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isTe ? 'చివరిసారి చూసిన సమయం' : 'Approximate Time Last Seen'}
                      </label>
                      <input
                        type="datetime-local"
                        value={missingDateTime}
                        onChange={(e) => setMissingDateTime(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Photo upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isTe ? 'వ్యక్తి తాజా ఫోటో (ఐచ్ఛికం, గరిష్టంగా 2MB)' : 'Recent Photograph (Optional, Max 2MB)'}
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-amber-400 transition-colors">
                      {imageFile ? (
                        <div className="space-y-2">
                          <img
                            src={imageFile}
                            alt="Uploaded preview"
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
                            {isTe ? 'ఫోటో అప్‌లోడ్ చేయండి (పోలీస్ నిఘా కోసం)' : 'Click to upload photograph for verification'}
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
                </div>

                {/* Reporter information */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">
                      {isTe ? 'ఫిర్యాదుదారుని సమాచారం' : 'Reporting Person Details'}
                    </h3>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                      🔒 {isTe ? 'రక్షిత సమాచారం' : 'Confidential'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isTe ? 'మీ పేరు *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="Reporter Full Name"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isTe ? 'మొబైల్ నంబర్ (కాల్ కోసం) *' : 'Contact Mobile *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isTe ? 'సంబంధం *' : 'Relation *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={reporterRelation}
                        onChange={(e) => setReporterRelation(e.target.value)}
                        placeholder={isTe ? 'తల్లి / తండ్రి / స్నేహితుడు' : 'Father / Mother / Friend'}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                  <p className="text-[11px] text-slate-500">
                    {isTe
                      ? 'ఈ నివేదిక తక్షణమే నగర వ్యాప్త పబ్లిక్ అనౌన్స్‌మెంట్ బృందాలకు మరియు ఘాట్ పోలీసులకు చేరుతుంది.'
                      : 'Alert immediately relayed to ghat announcement booths and security wardens.'}
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-xs transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isTe ? 'అత్యవసర అలర్ట్ నమోదు చేయండి' : 'Publish Missing Person Alert'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
