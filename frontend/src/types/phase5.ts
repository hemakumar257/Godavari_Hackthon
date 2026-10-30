// Phase 5 TypeScript Interfaces – Heritage Explorer & Personal Yatra Planner
// Godavari Pushkaralu 2027

export interface Coordinates {
  lat: number;
  lng: number;
}

export type HeritageCategory =
  | 'ancient_temple'
  | 'spiritual_place'
  | 'historical_place'
  | 'cultural_heritage'
  | 'river_heritage'
  | 'sacred_ghat'
  | 'festivals_traditions';

export interface VisitingInfo {
  bestTimeToVisitTe: string;
  bestTimeToVisitEn: string;
  timingsTe: string;
  timingsEn: string;
  entryFeeTe: string;
  entryFeeEn: string;
  dressCodeTe?: string;
  dressCodeEn?: string;
  photographyAllowed?: boolean;
}

export interface HeritageLocation {
  id: string;
  slug: string;
  nameTe: string;
  nameEn: string;
  category: HeritageCategory;
  categoryLabelTe: string;
  categoryLabelEn: string;
  shortDescTe: string;
  shortDescEn: string;
  fullDescTe: string;
  fullDescEn: string;
  historicalSignificanceTe: string;
  historicalSignificanceEn: string;
  spiritualSignificanceTe: string;
  spiritualSignificanceEn: string;
  culturalSignificanceTe: string;
  culturalSignificanceEn: string;
  storiesAndLegendsTe: string[];
  storiesAndLegendsEn: string[];
  imageUrl: string;
  gallery: string[];
  coordinates: Coordinates;
  addressTe: string;
  addressEn: string;
  visitingInfo: VisitingInfo;
  nearbyGhats?: { id: string; nameTe: string; nameEn: string }[];
  nearbyTemples?: { id: string; nameTe: string; nameEn: string }[];
  isFeatured?: boolean;
  isVerified: boolean;
  isDemo: boolean;
}

export interface HeritageStory {
  id: string;
  slug: string;
  titleTe: string;
  titleEn: string;
  category: string;
  categoryLabelTe: string;
  categoryLabelEn: string;
  introductionTe: string;
  introductionEn: string;
  contentTe: string[];
  contentEn: string[];
  coverImage: string;
  readingTimeMinutes: number;
  relatedLocations?: string[];
  isPublished: boolean;
  isDemo: boolean;
}

export interface GalleryItem {
  id: string;
  titleTe: string;
  titleEn: string;
  category: HeritageCategory;
  categoryLabelTe: string;
  categoryLabelEn: string;
  imageUrl: string;
  captionTe: string;
  captionEn: string;
  locationReference: string;
}

// ─── Yatra Planner Interfaces ───

export type StopReferenceType = 'ghat' | 'temple' | 'heritage' | 'event';

export interface YatraStop {
  stopId: string;
  referenceType: StopReferenceType;
  referenceId: string;
  nameTe: string;
  nameEn: string;
  categoryLabelTe: string;
  categoryLabelEn: string;
  thumbnailUrl: string;
  coordinates: Coordinates;
  sequence: number;
  plannedArrivalTime?: string; // e.g. "06:30 AM"
  estimatedDurationMinutes: number; // e.g. 60
  customNotes?: string;
  addressTe?: string;
  addressEn?: string;
}

export interface YatraItinerary {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  startingLocation: string;
  preferences: {
    categories: string[];
    pace: 'relaxed' | 'moderate' | 'intensive';
    interests?: string[];
  };
  stops: YatraStop[];
  totalDurationHours?: number;
  isTemplate?: boolean;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SuggestedYatraTemplate {
  id: string;
  slug: string;
  titleTe: string;
  titleEn: string;
  descTe: string;
  descEn: string;
  durationLabelTe: string;
  durationLabelEn: string;
  badgeTe: string;
  badgeEn: string;
  thumbnailUrl: string;
  tagsTe: string[];
  tagsEn: string[];
  stops: YatraStop[];
  totalStops: number;
}
