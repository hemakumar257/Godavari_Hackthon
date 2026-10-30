// Phase 4 TypeScript Interfaces – Live Pushkaralu & Video Streaming
// Godavari Pushkaralu 2027

export type StreamStatus = 'LIVE' | 'UPCOMING' | 'ENDED' | 'OFFLINE' | 'CANCELLED';

export type StreamCategory = 'ghat' | 'puja' | 'aarti' | 'temple' | 'cultural';

export interface LiveStream {
  id: string;
  slug: string;
  titleTe: string;
  titleEn: string;
  descTe: string;
  descEn: string;
  category: StreamCategory;
  categoryLabelTe: string;
  categoryLabelEn: string;
  venueTe: string;
  venueEn: string;
  locationReference?: string;
  thumbnailUrl: string;
  videoProvider: 'youtube';
  videoId: string;
  embedUrl?: string;
  language: 'te' | 'en' | 'all';
  scheduledStart: string; // ISO 8601 string
  scheduledEnd: string;   // ISO 8601 string
  status: StreamStatus;
  viewerCount?: string;
  isPublished: boolean;
  isAuthorized: boolean;
  isDemo: boolean;
  featured?: boolean;
  duration?: string;      // e.g. "45:20" for recordings
  recordingDate?: string; // e.g. "2027-07-15"
}

export interface StreamReminder {
  streamId: string;
  streamTitleTe: string;
  streamTitleEn: string;
  scheduledStart: string;
  createdAt: string;
}

export interface LiveStreamFilters {
  search: string;
  category: StreamCategory | 'all';
  status: StreamStatus | 'all';
  language: 'te' | 'en' | 'all';
  sortBy: 'upcoming' | 'recent' | 'alphabetical';
}
