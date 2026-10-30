// Phase 3 TypeScript Interfaces – Medical Assistance & Public Safety
// Godavari Pushkaralu 2027

import { Coordinates } from './phase2';
export type { Coordinates };

export type MedicalCampStatus = 'open' | 'closed' | '24_hours';

export type MedicalServiceType =
  | 'first_aid'
  | 'emergency_care'
  | 'general_physician'
  | 'ambulance_station'
  | 'ors_heat_relief'
  | 'pharmacy'
  | 'pediatric';

export type PoliceDeskStatus = 'active' | 'temporary' | '24_hours';

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export type LostFoundCategory =
  | 'mobile'
  | 'wallet'
  | 'bag'
  | 'jewellery'
  | 'documents'
  | 'clothing'
  | 'other';

export type IncidentCategory =
  | 'medical_emergency'
  | 'crowd_issue'
  | 'suspicious_activity'
  | 'infrastructure_hazard'
  | 'lost_person'
  | 'lost_and_found'
  | 'sanitation_issue'
  | 'general_assistance';

// ─── Emergency Contact ────────────────────────────────────────────────────────
export interface EmergencyContact {
  id: string;
  nameTe: string;
  nameEn: string;
  number: string;
  descTe: string;
  descEn: string;
  category: 'ambulance' | 'police' | 'women' | 'disaster' | 'health_info';
  isOfficial: boolean;
}

// ─── Medical Camp ─────────────────────────────────────────────────────────────
export interface MedicalCamp {
  id: string;
  nameTe: string;
  nameEn: string;
  descTe: string;
  descEn: string;
  addressTe: string;
  addressEn: string;
  coordinates: Coordinates;
  phone: string;
  services: MedicalServiceType[];
  serviceLabelsTe: string[];
  serviceLabelsEn: string[];
  status: MedicalCampStatus;
  operatingHours: string;
  distanceKm?: number;
  lastUpdated: string;
  isVerified: boolean;
  isDemo: boolean;
  doctorInCharge?: string;
  ambulanceAvailable: boolean;
  imageUrl: string;
}

// ─── Hospital ─────────────────────────────────────────────────────────────────
export interface Hospital {
  id: string;
  nameTe: string;
  nameEn: string;
  descTe: string;
  descEn: string;
  addressTe: string;
  addressEn: string;
  coordinates: Coordinates;
  phone: string;
  emergencyPhone: string;
  services: string[];
  hasEmergency: boolean;
  bedCapacity: number;
  isGovernment: boolean;
  distanceKm?: number;
  isDemo: boolean;
  imageUrl: string;
}

// ─── Police Help Desk ─────────────────────────────────────────────────────────
export interface PoliceDesk {
  id: string;
  nameTe: string;
  nameEn: string;
  descTe: string;
  descEn: string;
  addressTe: string;
  addressEn: string;
  coordinates: Coordinates;
  phone: string;
  operatingHours: string;
  status: PoliceDeskStatus;
  services: string[];
  serviceLabelsTe: string[];
  serviceLabelsEn: string[];
  isVerified: boolean;
  lastUpdated: string;
  isDemo: boolean;
  officerInCharge?: string;
  distanceKm?: number;
  imageUrl: string;
}

// ─── Lost and Found Report ────────────────────────────────────────────────────
export interface LostItemReportData {
  type: 'lost' | 'found';
  category: LostFoundCategory;
  itemName: string;
  description: string;
  approximateDateTime: string;
  locationName: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  imageBase64?: string;
}

// ─── Missing Person Report ────────────────────────────────────────────────────
export interface MissingPersonReportData {
  personName: string;
  ageRange: string;
  gender: string;
  description: string;
  clothingDescription: string;
  lastKnownLocation: string;
  approximateDateTime: string;
  reporterName: string;
  reporterPhone: string;
  reporterRelation: string;
  imageBase64?: string;
}

// ─── Incident Report ──────────────────────────────────────────────────────────
export interface IncidentReportData {
  category: IncidentCategory;
  title: string;
  description: string;
  locationName: string;
  coordinates?: Coordinates;
  incidentDateTime: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
  imageBase64?: string;
}

// ─── Report Tracking ──────────────────────────────────────────────────────────
export interface StatusTimelineEvent {
  status: ReportStatus;
  statusLabelTe: string;
  statusLabelEn: string;
  timestamp: string;
  publicNotesTe: string;
  publicNotesEn: string;
}

export interface ReportTrackingInfo {
  reportId: string;
  reportType: 'incident' | 'lost_found' | 'missing_person';
  categoryLabelTe: string;
  categoryLabelEn: string;
  title: string;
  submissionDate: string;
  currentStatus: ReportStatus;
  statusTimeline: StatusTimelineEvent[];
  lastUpdated: string;
  publicMessageTe: string;
  publicMessageEn: string;
}
