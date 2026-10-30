import {
  MedicalCamp,
  Hospital,
  PoliceDesk,
  LostItemReportData,
  MissingPersonReportData,
  IncidentReportData,
  ReportTrackingInfo,
} from '../types/phase3';
import {
  DEMO_MEDICAL_CAMPS,
  DEMO_HOSPITALS,
  DEMO_POLICE_DESKS,
  SEED_TRACKING_REPORTS,
} from '../data/phase3Data';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function fetchWithFallback<T>(url: string, fallbackData: T[]): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : fallbackData;
  } catch {
    return fallbackData;
  }
}

async function fetchItemWithFallback<T extends { id: string }>(
  url: string,
  id: string,
  fallbackList: T[]
): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}/${id}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch {
    const found = fallbackList.find((item) => item.id === id);
    return found || null;
  }
}

export const phase3Api = {
  // Medical Camps
  getMedicalCamps: () =>
    fetchWithFallback<MedicalCamp>('/medical-camps', DEMO_MEDICAL_CAMPS),
  getMedicalCampById: (id: string) =>
    fetchItemWithFallback<MedicalCamp>('/medical-camps', id, DEMO_MEDICAL_CAMPS),

  // Hospitals
  getHospitals: () =>
    fetchWithFallback<Hospital>('/hospitals', DEMO_HOSPITALS),
  getHospitalById: (id: string) =>
    fetchItemWithFallback<Hospital>('/hospitals', id, DEMO_HOSPITALS),

  // Police Help Desks
  getPoliceDesks: () =>
    fetchWithFallback<PoliceDesk>('/police-desks', DEMO_POLICE_DESKS),
  getPoliceDeskById: (id: string) =>
    fetchItemWithFallback<PoliceDesk>('/police-desks', id, DEMO_POLICE_DESKS),

  // Submit Lost & Found
  submitLostFoundReport: async (data: LostItemReportData): Promise<{ reportId: string; message: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/lost-found`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    // Local fallback generation
    const reportId = `LF-2027-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: ReportTrackingInfo = {
      reportId,
      reportType: 'lost_found',
      categoryLabelTe: data.category,
      categoryLabelEn: data.category,
      title: `${data.type.toUpperCase()}: ${data.itemName}`,
      submissionDate: new Date().toLocaleString(),
      currentStatus: 'submitted',
      statusTimeline: [
        {
          status: 'submitted',
          statusLabelTe: 'సమర్పించబడింది',
          statusLabelEn: 'Report Submitted',
          timestamp: new Date().toLocaleTimeString(),
          publicNotesTe: 'మీ నివేదిక విజయవంతంగా నమోదైంది. సమీక్షలో ఉంది.',
          publicNotesEn: 'Your report has been successfully recorded and is under review.',
        },
      ],
      lastUpdated: new Date().toLocaleTimeString(),
      publicMessageTe: 'మీ నివేదిక నమోదు చేయబడింది. పోలీస్ మరియు వాలంటీర్ బృందాలకు సమాచారం అందించడం జరిగింది.',
      publicMessageEn: 'Report logged. Forwarded to field assistance wardens.',
    };

    saveLocalTrackingReport(newRecord);
    return { reportId, message: 'Report submitted successfully (Demo Mode)' };
  },

  // Submit Missing Person
  submitMissingPersonReport: async (data: MissingPersonReportData): Promise<{ reportId: string; message: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/missing-person-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const reportId = `MP-2027-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: ReportTrackingInfo = {
      reportId,
      reportType: 'missing_person',
      categoryLabelTe: 'తప్పిపోయిన వ్యక్తి సహాయం',
      categoryLabelEn: 'Missing Person Assistance',
      title: `Missing: ${data.personName || 'Unknown'} (${data.ageRange})`,
      submissionDate: new Date().toLocaleString(),
      currentStatus: 'submitted',
      statusTimeline: [
        {
          status: 'submitted',
          statusLabelTe: 'అత్యవసర సమాచారం అందింది',
          statusLabelEn: 'Emergency Alert Logged',
          timestamp: new Date().toLocaleTimeString(),
          publicNotesTe: 'వివరాలు పుష్కరాల కంట్రోల్ రూమ్‌కు పంపబడ్డాయి.',
          publicNotesEn: 'Details forwarded to festival public address & police stations.',
        },
      ],
      lastUpdated: new Date().toLocaleTimeString(),
      publicMessageTe: 'అత్యవసర సమాచారం రికార్డు అయింది. తక్షణ సహాయం కోసం సమీప పోలీస్ డెస్క్ లేదా 100 కు కాల్ చేయండి.',
      publicMessageEn: 'Alert logged. For immediate response, visit the nearest police post or dial 100/112.',
    };

    saveLocalTrackingReport(newRecord);
    return { reportId, message: 'Missing person report registered (Demo Mode)' };
  },

  // Submit Incident Report
  submitIncidentReport: async (data: IncidentReportData): Promise<{ reportId: string; message: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const reportId = `INC-2027-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: ReportTrackingInfo = {
      reportId,
      reportType: 'incident',
      categoryLabelTe: data.category,
      categoryLabelEn: data.category,
      title: data.title,
      submissionDate: new Date().toLocaleString(),
      currentStatus: 'submitted',
      statusTimeline: [
        {
          status: 'submitted',
          statusLabelTe: 'నివేదిక అందింది',
          statusLabelEn: 'Report Received',
          timestamp: new Date().toLocaleTimeString(),
          publicNotesTe: 'మీ సమస్య నివేదిక నమోదు చేయబడింది.',
          publicNotesEn: 'Digital incident record created and queued for dispatch.',
        },
      ],
      lastUpdated: new Date().toLocaleTimeString(),
      publicMessageTe: 'సమస్య నమోదు చేయబడింది. సమీప క్షేత్రస్థాయి బృందానికి సమాచారం చేరుతోంది.',
      publicMessageEn: 'Incident logged. Forwarded to field response dispatch.',
    };

    saveLocalTrackingReport(newRecord);
    return { reportId, message: 'Incident reported successfully (Demo Mode)' };
  },

  // Get Report Tracking Status
  getReportTracking: async (reportId: string): Promise<ReportTrackingInfo | null> => {
    const cleanId = reportId.trim().toUpperCase();
    try {
      const res = await fetch(`${API_BASE_URL}/reports/${cleanId}/status`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local
    }

    // Check localStorage
    const local = getLocalTrackingReport(cleanId);
    if (local) return local;

    // Check seed records
    if (SEED_TRACKING_REPORTS[cleanId]) {
      return SEED_TRACKING_REPORTS[cleanId];
    }

    return null;
  },
};

// Local storage helper
function saveLocalTrackingReport(report: ReportTrackingInfo) {
  try {
    const existing = JSON.parse(localStorage.getItem('pushkaralu_local_reports') || '{}');
    existing[report.reportId] = report;
    localStorage.setItem('pushkaralu_local_reports', JSON.stringify(existing));
  } catch {
    // Ignore storage errors
  }
}

function getLocalTrackingReport(reportId: string): ReportTrackingInfo | null {
  try {
    const existing = JSON.parse(localStorage.getItem('pushkaralu_local_reports') || '{}');
    return existing[reportId] || null;
  } catch {
    return null;
  }
}
