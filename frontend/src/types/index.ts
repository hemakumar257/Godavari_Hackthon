export type Language = 'te' | 'en';

export interface HeroSlide {
  id: string;
  titleTe: string;
  titleEn: string;
  subtitleTe: string;
  subtitleEn: string;
  tagTe: string;
  tagEn: string;
  imageUrl: string;
  locationTe: string;
  locationEn: string;
  captionTe: string;
  captionEn: string;
}

export interface QuickService {
  id: string;
  titleTe: string;
  titleEn: string;
  descTe: string;
  descEn: string;
  path: string;
  iconName: string;
  badge?: string;
  category: 'primary' | 'safety' | 'explore';
}

export interface EventPreview {
  id: string;
  titleTe: string;
  titleEn: string;
  locationTe: string;
  locationEn: string;
  dateStrTe: string;
  dateStrEn: string;
  timeStr: string;
  categoryTe: string;
  categoryEn: string;
  isDemo: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface LiveStreamPreview {
  id: string;
  titleTe: string;
  titleEn: string;
  locationTe: string;
  locationEn: string;
  categoryTe: string;
  categoryEn: string;
  thumbnailUrl: string;
  isDemo: boolean;
  status: 'live' | 'upcoming' | 'offline';
  viewerCount?: string;
}

export interface Announcement {
  id: string;
  titleTe: string;
  titleEn: string;
  descTe: string;
  descEn: string;
  date: string;
  severity: 'info' | 'important' | 'alert';
  isDemo: boolean;
}

export interface HeritagePreview {
  id: string;
  titleTe: string;
  titleEn: string;
  descTe: string;
  descEn: string;
  locationTe: string;
  locationEn: string;
  imageUrl: string;
  tagTe: string;
  tagEn: string;
}
