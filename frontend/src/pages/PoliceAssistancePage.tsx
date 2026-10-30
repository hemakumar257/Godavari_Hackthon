import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { PoliceDesk } from '../types/phase3';
import { OFFICIAL_EMERGENCY_CONTACTS } from '../data/phase3Data';
import { phase3Api } from '../services/phase3Api';
import { EmergencyContactCard } from '../components/common/EmergencyContactCard';
import { PoliceDeskCard } from '../components/police/PoliceDeskCard';
import { InteractiveMap, MapPoint } from '../components/map/InteractiveMap';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { DemoBadge } from '../components/common/DemoBadge';
import { useGeolocation } from '../hooks/useGeolocation';
import {
  ShieldAlert,
  Search,
  MapPin,
  CheckCircle2,
  FileQuestion,
  UserCheck,
  AlertTriangle,
  Eye,
  Layers,
  PhoneCall,
} from 'lucide-react';

export const PoliceAssistancePage: React.FC = () => {
  const { isTe } = useLanguage();
  const navigate = useNavigate();
  const {
    location: userLocation,
    loading: geoLoading,
    requestLocation,
    calculateDistance,
    error: geoError,
  } = useGeolocation();

  const [activeTab, setActiveTab] = useState<'desks' | 'map'>('desks');
  const [desks, setDesks] = useState<PoliceDesk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');

  const loadDesks = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await phase3Api.getPoliceDesks();
      setDesks(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDesks();
  }, []);

  const desksWithDistance = desks.map((d) => ({
    ...d,
    distanceKm: calculateDistance(d.coordinates),
  }));

  if (userLocation) {
    desksWithDistance.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
  }

  const filteredDesks = desksWithDistance.filter((d) => {
    const name = (isTe ? d.nameTe : d.nameEn).toLowerCase();
    const desc = (isTe ? d.descTe : d.descEn).toLowerCase();
    const addr = (isTe ? d.addressTe : d.addressEn).toLowerCase();
    const s = search.toLowerCase();
    return !search || name.includes(s) || desc.includes(s) || addr.includes(s);
  });

  const mapPoints: MapPoint[] = filteredDesks.map((d) => ({
    id: d.id,
    type: 'facility',
    title: isTe ? d.nameTe : d.nameEn,
    subtitle: `${d.operatingHours} • ${d.phone}`,
    coordinates: d.coordinates,
    isDemo: d.isDemo,
  }));

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isTe ? 'పోలీస్ & ప్రజా భద్రతా సేవలు' : 'Police & Public Safety Outposts'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isTe ? 'పోలీస్ సహాయ కేంద్రాల డైరెక్టరీ' : 'Police Assistance & Security Desks'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isTe
              ? 'రాజమహేంద్రవరం ఘాట్‌లు, ట్రాఫిక్ జంక్షన్లు, మరియు రైల్వే స్టేషన్ల వద్ద రక్షక భట ఔట్‌పోస్టులు, తప్పిపోయిన వారి విభాగం మరియు నదీ రక్షణ కేంద్రాలు.'
              : 'Directory of 24x7 police outposts, specialized river police motorboat patrols, lost-and-found coordination, and emergency response.'}
          </p>
          <div className="pt-2">
            <DemoBadge variant="banner" />
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => navigate('/lost-and-found')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 text-left shadow-xs hover:shadow-md transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
              <FileQuestion className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {isTe ? 'తప్పిపోయిన / దొరికిన వస్తువులు' : 'Lost & Found Registry'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTe ? 'వస్తువు పోయిందా? ఇక్కడ రిపోర్ట్ చేయండి' : 'Report lost or found belongings'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/lost-and-found?tab=missing')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 text-left shadow-xs hover:shadow-md transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {isTe ? 'తప్పిపోయిన వ్యక్తుల సహాయం' : 'Missing Persons Desk'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTe ? 'పిల్లలు లేదా పెద్దలు తప్పిపోతే' : 'Urgent missing person alerts'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/report-incident')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 text-left shadow-xs hover:shadow-md transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {isTe ? 'సమస్యను నివేదించండి' : 'Report an Incident'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTe ? 'రద్దీ, పారిశుద్ధ్యం లేదా ప్రమాదం' : 'Crowd hazard, safety issues'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/track-report')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 text-left shadow-xs hover:shadow-md transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {isTe ? 'రిపోర్ట్ ట్రాకింగ్' : 'Track Status'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTe ? 'ట్రాకింగ్ ఐడీతో స్టేటస్ చూడండి' : 'Check report progress with ID'}
              </p>
            </div>
          </button>
        </div>

        {/* Emergency Hotlines Row */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isTe ? 'అధికారిక పోలీస్ హెల్ప్‌లైన్లు' : 'Official Police Emergency Helplines'}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {OFFICIAL_EMERGENCY_CONTACTS.filter((c) => c.category === 'police' || c.category === 'women').map((contact) => (
              <EmergencyContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>

        {/* Location Detection Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                {userLocation
                  ? isTe
                    ? 'మీ లొకేషన్ గుర్తించబడింది ✓'
                    : 'Location Active ✓'
                  : isTe
                  ? 'సమీప పోలీస్ హెల్ప్ డెస్క్‌ను గుర్తించండి'
                  : 'Find the Nearest Police Assistance Desk'}
              </h3>
              <p className="text-xs text-slate-500">
                {userLocation
                  ? isTe
                    ? `సమీప పోలీస్ ఔట్‌పోస్టుల దూరం లెక్కించబడింది.`
                    : `Police posts sorted by distance from you.`
                  : isTe
                  ? 'జియోలొకేషన్ ఆన్ చేసి దగ్గరి సహాయ కేంద్రాన్ని సులభంగా చేరుకోండి'
                  : 'Enable location for real-time proximity sorting'}
              </p>
              {geoError && <p className="text-xs text-amber-600 mt-1">{geoError}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!userLocation ? (
              <button
                type="button"
                onClick={requestLocation}
                disabled={geoLoading}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {geoLoading
                    ? isTe
                      ? 'గుర్తిస్తోంది...'
                      : 'Detecting...'
                    : isTe
                    ? 'నా స్థానం వాడండి'
                    : 'Use My Location'}
                </span>
              </button>
            ) : (
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isTe ? 'సమీప క్రమంలో అమర్చబడ్డాయి' : 'Proximity Enabled'}
              </span>
            )}
          </div>
        </div>

        {/* View Switcher: List vs Map */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('desks')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'desks'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>
                {isTe ? 'పోలీస్ డెస్క్‌ల జాబితా' : 'Police Posts'} ({desks.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'map'
                  ? 'bg-godavari-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isTe ? 'మ్యాప్ వ్యూ' : 'Interactive Map'}</span>
            </button>
          </div>
        </div>

        {/* Search */}
        {activeTab === 'desks' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  isTe
                    ? 'పోలీస్ పోస్ట్ పేరు లేదా ప్రాంతంతో వెతకండి...'
                    : 'Search police desk by name or ghat area...'
                }
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        {loading ? (
          <LoadingState
            messageTe="పోలీస్ సహాయ కేంద్రాల వివరాలు లోడ్ అవుతున్నాయి..."
            messageEn="Loading police assistance posts..."
          />
        ) : error ? (
          <ErrorState onRetry={loadDesks} />
        ) : activeTab === 'desks' ? (
          filteredDesks.length === 0 ? (
            <EmptyState
              titleTe="ఎలాంటి పోలీస్ కేంద్రాలు కనుగొనబడలేదు"
              titleEn="No police desks found"
              actionTextTe="వెతుకులాటను క్లియర్ చేయండి"
              actionTextEn="Clear Search"
              onAction={() => setSearch('')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDesks.map((desk) => (
                <PoliceDeskCard
                  key={desk.id}
                  desk={desk}
                  userCoords={userLocation}
                  distanceKm={desk.distanceKm}
                />
              ))}
            </div>
          )
        ) : (
          <div className="space-y-4">
            <InteractiveMap
              points={mapPoints}
              userCoords={userLocation}
              height="600px"
              center={userLocation || { lat: 16.9854, lng: 81.7830 }}
              zoom={14}
            />
          </div>
        )}
      </div>
    </div>
  );
};
