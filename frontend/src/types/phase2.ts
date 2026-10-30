// Phase 2 TypeScript Interfaces – Godavari Pushkaralu 2027
// All demo data is clearly labeled with isDemo: true

export type GhatStatus = 'open' | 'closed' | 'restricted';
export type CrowdStatus = 'low' | 'moderate' | 'high' | 'unknown';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed';
export type ParkingStatus = 'available' | 'filling' | 'full' | 'unknown';
export type FacilityCategory =
  | 'drinking_water'
  | 'toilet'
  | 'rest_area'
  | 'food_stall'
  | 'medical'
  | 'atm'
  | 'police'
  | 'lost_found'
  | 'changing_room'
  | 'wheelchair';

export type EventCategory =
  | 'religious'
  | 'puja'
  | 'aarti'
  | 'cultural'
  | 'temple'
  | 'special'
  | 'announcement';

// ─── Coordinates ─────────────────────────────────────────────────────────────
export interface Coordinates {
  lat: number;
  lng: number;
}

// ─── Event ───────────────────────────────────────────────────────────────────
export interface PushkaraluEvent {
  id: string;
  titleTe: string;
  titleEn: string;
  descTe: string;
  descEn: string;
  date: string;           // ISO date string e.g. "2027-07-15"
  startTime: string;      // e.g. "06:00"
  endTime: string;        // e.g. "08:00"
  venueTe: string;
  venueEn: string;
  category: EventCategory;
  categoryLabelTe: string;
  categoryLabelEn: string;
  coordinates: Coordinates;
  status: EventStatus;
  imageUrl: string;
  isDemo: boolean;
  isFeatured?: boolean;
}

// ─── Ghat ─────────────────────────────────────────────────────────────────────
export interface Ghat {
  id: string;
  nameTe: string;
  nameEn: string;
  descTe: string;
  descEn: string;
  addressTe: string;
  addressEn: string;
  coordinates: Coordinates;
  status: GhatStatus;
  crowdStatus: CrowdStatus;
  crowdPercentage: number;   // 0-100
  isAccessible: boolean;
  hasChangingRooms: boolean;
  hasMedicalCamp: boolean;
  distanceKm?: number;        // filled dynamically from user location
  imageUrl: string;
  amenities: string[];        // English labels
  nearbyLandmark: string;
  safeDepthInfo: string;
  isDemo: boolean;
}

// ─── Temple ───────────────────────────────────────────────────────────────────
export interface Temple {
  id: string;
  nameTe: string;
  nameEn: string;
  descTe: string;
  descEn: string;
  addressTe: string;
  addressEn: string;
  coordinates: Coordinates;
  timings: string;            // e.g. "5:00 AM – 12:00 PM, 4:00 PM – 9:00 PM"
  deity: string;
  imageUrl: string;
  isDemo: boolean;
  distanceKm?: number;
}

// ─── Parking ──────────────────────────────────────────────────────────────────
export interface ParkingLocation {
  id: string;
  nameTe: string;
  nameEn: string;
  addressTe: string;
  addressEn: string;
  coordinates: Coordinates;
  status: ParkingStatus;
  totalCapacity: number;
  availableSlots: number;
  vehicleTypes: string[];     // e.g. ["Car", "Bus", "Two-Wheeler"]
  distanceToGhatKm: number;
  nearestGhatEn: string;
  imageUrl: string;
  isDemo: boolean;
  distanceKm?: number;
}

// ─── Facility ─────────────────────────────────────────────────────────────────
export interface Facility {
  id: string;
  nameTe: string;
  nameEn: string;
  category: FacilityCategory;
  categoryLabelTe: string;
  categoryLabelEn: string;
  addressTe: string;
  addressEn: string;
  coordinates: Coordinates;
  isOpen: boolean;
  operatingHours: string;
  contactNumber?: string;
  imageUrl: string;
  isDemo: boolean;
  distanceKm?: number;
}

// ─── User Location ────────────────────────────────────────────────────────────
export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

// ─── Ghat Recommendation ─────────────────────────────────────────────────────
export interface GhatRecommendation {
  ghat: Ghat;
  score: number;
  reasonsTe: string[];
  reasonsEn: string[];
}

// ─── Filter / Search State ────────────────────────────────────────────────────
export interface EventFilters {
  search: string;
  category: EventCategory | 'all';
  dateFilter: 'all' | 'today' | 'tomorrow' | 'upcoming';
}

export interface GhatFilters {
  search: string;
  status: GhatStatus | 'all';
  crowdStatus: CrowdStatus | 'all';
  nearbyOnly: boolean;
  accessibleOnly: boolean;
}
