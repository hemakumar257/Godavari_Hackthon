import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { MedicalCamp, Hospital, MedicalServiceType } from '../types/phase3';
import { OFFICIAL_EMERGENCY_CONTACTS } from '../data/phase3Data';
import { phase3Api } from '../services/phase3Api';
import { EmergencyContactCard } from '../components/common/EmergencyContactCard';
import { MedicalCampCard } from '../components/medical/MedicalCampCard';
import { HospitalCard } from '../components/medical/HospitalCard';
import { InteractiveMap, MapPoint } from '../components/map/InteractiveMap';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { DemoBadge } from '../components/common/DemoBadge';
import { useGeolocation } from '../hooks/useGeolocation';
import {
  HeartPulse,
  Search,
  Building2,
  MapPin,
  CheckCircle2,
  Filter,
  Layers,
  PhoneCall,
} from 'lucide-react';

export const MedicalAssistancePage: React.FC = () => {
  const { isTe } = useLanguage();
  const {
    location: userLocation,
    loading: geoLoading,
    requestLocation,
    calculateDistance,
    error: geoError,
  } = useGeolocation();

  const [activeTab, setActiveTab] = useState<'camps' | 'hospitals' | 'map'>('camps');
  const [camps, setCamps] = useState<MedicalCamp[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState<MedicalServiceType | 'all'>('all');
  const [nearbyOnly, setNearbyOnly] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [campList, hospitalList] = await Promise.all([
        phase3Api.getMedicalCamps(),
        phase3Api.getHospitals(),
      ]);
      setCamps(campList);
      setHospitals(hospitalList);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const servicesOptions: { key: MedicalServiceType | 'all'; labelTe: string; labelEn: string }[] = [
    { key: 'all', labelTe: 'అన్ని సేవలు', labelEn: 'All Services' },
    { key: 'first_aid', labelTe: 'ప్రథమ చికిత్స', labelEn: 'First Aid' },
    { key: 'emergency_care', labelTe: 'అత్యవసర చికిత్స', labelEn: 'Emergency Care' },
    { key: 'ambulance_station', labelTe: 'అంబులెన్స్ సదుపాయం', labelEn: 'Ambulance Stand' },
    { key: 'ors_heat_relief', labelTe: 'ఎండ / ఓఆర్ఎస్ ఉపశమనం', labelEn: 'ORS & Heat Relief' },
    { key: 'pediatric', labelTe: 'చిన్నపిల్లల వైద్యం', labelEn: 'Pediatric Care' },
  ];

  // Distances
  const campsWithDistance = camps.map((c) => ({
    ...c,
    distanceKm: calculateDistance(c.coordinates),
  }));

  const hospitalsWithDistance = hospitals.map((h) => ({
    ...h,
    distanceKm: calculateDistance(h.coordinates),
  }));

  if (userLocation) {
    campsWithDistance.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    hospitalsWithDistance.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
  }

  // Filtered lists
  const filteredCamps = campsWithDistance.filter((c) => {
    const name = (isTe ? c.nameTe : c.nameEn).toLowerCase();
    const desc = (isTe ? c.descTe : c.descEn).toLowerCase();
    const addr = (isTe ? c.addressTe : c.addressEn).toLowerCase();
    const s = search.toLowerCase();

    if (search && !name.includes(s) && !desc.includes(s) && !addr.includes(s)) return false;
    if (serviceFilter !== 'all' && !c.services.includes(serviceFilter)) return false;
    if (nearbyOnly && (c.distanceKm === undefined || c.distanceKm > 5)) return false;
    return true;
  });

  const filteredHospitals = hospitalsWithDistance.filter((h) => {
    const name = (isTe ? h.nameTe : h.nameEn).toLowerCase();
    const addr = (isTe ? h.addressTe : h.addressEn).toLowerCase();
    const s = search.toLowerCase();
    if (search && !name.includes(s) && !addr.includes(s)) return false;
    if (nearbyOnly && (h.distanceKm === undefined || h.distanceKm > 8)) return false;
    return true;
  });

  // Map markers
  const mapPoints: MapPoint[] = [
    ...filteredCamps.map((c) => ({
      id: c.id,
      type: 'facility' as const,
      title: isTe ? c.nameTe : c.nameEn,
      subtitle: `${c.operatingHours} • ${c.phone}`,
      coordinates: c.coordinates,
      isDemo: c.isDemo,
    })),
    ...filteredHospitals.map((h) => ({
      id: h.id,
      type: 'facility' as const,
      title: isTe ? h.nameTe : h.nameEn,
      subtitle: `${h.bedCapacity} beds • ${h.phone}`,
      coordinates: h.coordinates,
      isDemo: h.isDemo,
    })),
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
            <span>{isTe ? 'అత్యవసర వైద్య సహాయ సేవలు 24x7' : 'Emergency Medical Assistance 24x7'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isTe ? 'వైద్య శిబిరాలు & ఆసుపత్రుల డైరెక్టరీ' : 'Medical Camps & Hospital Directory'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isTe
              ? 'గోదావరి పుష్కరాల ఘాట్‌ల వద్ద ప్రాథమిక చికిత్స శిబిరాలు, ప్రభుత్వ ఆసుపత్రులు, అంబులెన్స్ సేవలు మరియు వైద్య సలహా కేంద్రాలు.'
              : 'Locate 24/7 on-ghat first-aid posts, multi-specialty hospitals, emergency ambulances, and certified healthcare teams.'}
          </p>
          <div className="pt-2">
            <DemoBadge variant="banner" />
          </div>
        </div>

        {/* 24x7 Verified Official Emergency Hotlines Banner */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>{isTe ? 'అధికారిక అత్యవసర నంబర్లు (ఉచితం)' : 'Official Emergency Helplines (Toll-Free)'}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFFICIAL_EMERGENCY_CONTACTS.slice(0, 3).map((contact) => (
              <EmergencyContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>

        {/* Location Detection Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                {userLocation
                  ? isTe
                    ? 'మీ లొకేషన్ గుర్తించబడింది ✓'
                    : 'Location Active ✓'
                  : isTe
                  ? 'సమీప వైద్య శిబిరాన్ని కనుగొనండి'
                  : 'Find the Nearest Medical Station'}
              </h3>
              <p className="text-xs text-slate-500">
                {userLocation
                  ? isTe
                    ? `సమీప ఆసుపత్రులు మరియు శిబిరాలకు దూరం లెక్కించబడింది.`
                    : `Medical posts sorted by distance from your position.`
                  : isTe
                  ? 'జియోలొకేషన్ ఆన్ చేసి దగ్గరి వైద్య శిబిరాన్ని గుర్తించండి'
                  : 'Enable location to sort by real-time proximity'}
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
                className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
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

        {/* Navigation Tabs (Camps vs Hospitals vs Interactive Map) */}
        <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('camps')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'camps'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>
              {isTe ? 'ఘాట్ వైద్య శిబిరాలు' : 'Medical Camps'} ({camps.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hospitals')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'hospitals'
                ? 'bg-godavari-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>
              {isTe ? 'ఆసుపత్రుల జాబితా' : 'Hospitals'} ({hospitals.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'map'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isTe ? 'మ్యాప్ వ్యూ' : 'Interactive Map'}</span>
          </button>
        </div>

        {/* Search & Service Filter Controls (for Camps and Hospitals) */}
        {activeTab !== 'map' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeTab === 'camps'
                    ? isTe
                      ? 'శిబిరం పేరు, ఘాట్ ప్రాంతం లేదా వైద్యుని పేరుతో వెతకండి...'
                      : 'Search medical camp by name, ghat, or landmark...'
                    : isTe
                    ? 'ఆసుపత్రి పేరు లేదా రోడ్డుతో వెతకండి...'
                    : 'Search hospital by name or area...'
                }
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-slate-50/50"
              />
            </div>

            {activeTab === 'camps' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  {isTe ? 'చికిత్సా విభాగం:' : 'Service:'}
                </span>
                {servicesOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setServiceFilter(opt.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      serviceFilter === opt.key
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isTe ? opt.labelTe : opt.labelEn}
                  </button>
                ))}

                {userLocation && (
                  <button
                    type="button"
                    onClick={() => setNearbyOnly(!nearbyOnly)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ml-auto ${
                      nearbyOnly
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    📍 {isTe ? 'సమీపంలోనివి (< 5 km)' : 'Nearby (< 5 km)'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Content Tabs */}
        {loading ? (
          <LoadingState
            messageTe="వైద్య సేవల సమాచారం లోడ్ అవుతోంది..."
            messageEn="Loading emergency medical services..."
          />
        ) : error ? (
          <ErrorState onRetry={loadData} />
        ) : activeTab === 'camps' ? (
          filteredCamps.length === 0 ? (
            <EmptyState
              titleTe="ఎలాంటి వైద్య శిబిరాలు కనుగొనబడలేదు"
              titleEn="No medical camps match your criteria"
              actionTextTe="ఫిల్టర్లు క్లియర్ చేయండి"
              actionTextEn="Clear Filters"
              onAction={() => {
                setSearch('');
                setServiceFilter('all');
                setNearbyOnly(false);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCamps.map((camp) => (
                <MedicalCampCard
                  key={camp.id}
                  camp={camp}
                  userCoords={userLocation}
                  distanceKm={camp.distanceKm}
                />
              ))}
            </div>
          )
        ) : activeTab === 'hospitals' ? (
          filteredHospitals.length === 0 ? (
            <EmptyState
              titleTe="ఎలాంటి ఆసుపత్రులు కనుగొనబడలేదు"
              titleEn="No hospitals found"
              actionTextTe="వెతుకులాటను క్లియర్ చేయండి"
              actionTextEn="Clear Search"
              onAction={() => setSearch('')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHospitals.map((hosp) => (
                <HospitalCard
                  key={hosp.id}
                  hospital={hosp}
                  userCoords={userLocation}
                  distanceKm={hosp.distanceKm}
                />
              ))}
            </div>
          )
        ) : (
          /* Map View */
          <div className="space-y-4">
            <InteractiveMap
              points={mapPoints}
              userCoords={userLocation}
              height="600px"
              center={userLocation || { lat: 16.9855, lng: 81.7828 }}
              zoom={14}
            />
            <p className="text-xs text-slate-500 text-center">
              {isTe
                ? 'మ్యాప్‌లోని చిహ్నాన్ని క్లిక్ చేసి నేరుగా గూగుల్ మ్యాప్స్ దిశలను తెరవండి.'
                : 'Click on any medical marker to view hours, contact, and turn-by-turn navigation.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
